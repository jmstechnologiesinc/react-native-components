/**
 * The geometry of a `StateFlow`: where each node sits and the SVG path, arrowhead and label of each edge, from the
 * host's grid (`row`, `column`), the measured width and the theme's spacing. Pure, so it is tested without drawing.
 *
 * Every edge is drawn, not only the ones between neighbours:
 * - two states on the same row are joined by arcs: the edges going right bow above the row, the ones going left
 *   below it, each further pair of the same two states one lane further out, so parallel edges never overlap;
 * - two states on the same column are joined by a straight line when a single edge joins neighbours (its label
 *   beside it), else by arcs bowing right (going down) and left (going up);
 * - any other two states by a straight line between their boxes.
 * The rows' and columns' gaps grow with the lanes their arcs need, so a label never sits on a node.
 */

// A label's line box and the width of one character, as fractions of the font size: enough to reserve the room a
// label beside a vertical line needs (Roboto's average advance is about 0.55em).
const LABEL_LINE = 1.4;
const CHARACTER_WIDTH = 0.6;
// A cubic arc whose control points sit at `depth / 0.75` reaches `depth` at its apex.
const APEX = 0.75;

const orderOf = (a, b) => (a.row === b.row ? a.column - b.column : a.row - b.row);

/** Groups the edges by the two states they join, each pair once, its states in grid order. */
const pairsOf = (edges, byId) => {
    const pairs = new Map();
    edges.forEach((edge) => {
        const a = byId[edge.from];
        const b = byId[edge.to];
        if (!a || !b || a === b) return;
        const [first, second] = orderOf(a, b) <= 0 ? [a, b] : [b, a];
        const key = `${first.id}|${second.id}`;
        if (!pairs.has(key)) pairs.set(key, { first, second, forward: [], backward: [] });
        pairs.get(key)[edge.from === first.id ? 'forward' : 'backward'].push(edge);
    });
    return [...pairs.values()];
};

/** How each pair is drawn, and the lanes (in arcs) each row and column needs on each side. */
const routesOf = (pairs, rows, columns) => {
    const lanes = {
        above: Array(rows).fill(0),
        below: Array(rows).fill(0),
        right: Array(columns).fill(0),
        left: Array(columns).fill(0),
        rightLabel: Array(columns).fill(0),
        leftLabel: Array(columns).fill(0),
    };
    const routes = [];
    pairs.forEach((pair) => {
        const { first, second, forward, backward } = pair;
        if (first.row === second.row) {
            // A pair further apart bows further out, over the arcs of the states between them.
            const base = second.column - first.column - 1;
            forward.forEach((edge, index) => routes.push({ edge, pair, kind: 'above', depth: base + index + 1 }));
            backward.forEach((edge, index) => routes.push({ edge, pair, kind: 'below', depth: base + index + 1 }));
            lanes.above[first.row] = Math.max(lanes.above[first.row], base + forward.length);
            lanes.below[first.row] = Math.max(lanes.below[first.row], base + backward.length);
        } else if (first.column === second.column) {
            const single = forward.length + backward.length === 1 && second.row - first.row === 1;
            if (single) {
                routes.push({ edge: forward[0] ?? backward[0], pair, kind: 'straight' });
                return;
            }
            const base = second.row - first.row - 1;
            forward.forEach((edge, index) => routes.push({ edge, pair, kind: 'right', depth: base + index + 1 }));
            backward.forEach((edge, index) => routes.push({ edge, pair, kind: 'left', depth: base + index + 1 }));
            const longest = (list) => Math.max(0, ...list.map((edge) => String(edge.label ?? '').length));
            lanes.right[first.column] = Math.max(lanes.right[first.column], base + forward.length);
            lanes.left[first.column] = Math.max(lanes.left[first.column], base + backward.length);
            lanes.rightLabel[first.column] = Math.max(lanes.rightLabel[first.column], longest(forward));
            lanes.leftLabel[first.column] = Math.max(lanes.leftLabel[first.column], longest(backward));
        } else {
            [...forward, ...backward].forEach((edge) => routes.push({ edge, pair, kind: 'straight' }));
        }
    });
    return { routes, lanes };
};

/** The point where the segment from a box's centre towards `toward` leaves the box. */
const exitOf = (box, toward) => {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const dx = toward.x - cx;
    const dy = toward.y - cy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const scale = Math.min(
        dx === 0 ? Infinity : box.width / 2 / Math.abs(dx),
        dy === 0 ? Infinity : box.height / 2 / Math.abs(dy)
    );
    return { x: cx + dx * scale, y: cy + dy * scale };
};

/** A triangle whose tip is `tip`, pointing along the direction from `from` to `tip`. */
const arrowOf = (from, tip, size) => {
    const dx = tip.x - from.x;
    const dy = tip.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const bx = tip.x - ux * size;
    const by = tip.y - uy * size;
    const px = -uy * (size / 2);
    const py = ux * (size / 2);
    return `M ${tip.x} ${tip.y} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z`;
};

const round = (value) => Math.round(value * 10) / 10;

/**
 * @param {{nodes: Array<{id: string, row: number, column: number}>, edges: Array<{id: string, from: string,
 *     to: string, label?: string}>, width: number | null, spacing: object, fontSize: number}} input
 * @returns {{height: number, width: number, boxes: Object<string, {x: number, y: number, width: number,
 *     height: number}>, edges: Array<{id: string, path: string, arrow: string, label: {x: number, y: number,
 *     anchor: string}}>}} `width` is the drawing's: the one given, or wider when a node would be narrower than
 *     `spacing.x20 + spacing.x10` (the host scrolls it then); `boxes` and `edges` are empty until a width is
 *     given; `height` never depends on it.
 */
export const stateFlowLayout = ({ nodes, edges, width, spacing, fontSize }) => {
    const rows = Math.max(0, ...nodes.map((node) => node.row)) + 1;
    const columns = Math.max(0, ...nodes.map((node) => node.column)) + 1;
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const { routes, lanes } = routesOf(pairsOf(edges, byId), rows, columns);

    const step = spacing.x8;
    const nodeHeight = spacing.x12;
    const margin = spacing.x2;
    const labelHeight = fontSize * LABEL_LINE;
    const labelWidth = (characters) => (characters ? characters * fontSize * CHARACTER_WIDTH + spacing.x2 : 0);
    const laneOf = (count) => (count ? count * step + labelHeight : 0);

    // Rows: each keeps room above and below for its arcs; two rows are at least a row apart, so a straight line
    // between them has room for its label.
    const rowTop = [];
    let y = margin + laneOf(lanes.above[0]);
    for (let row = 0; row < rows; row += 1) {
        rowTop.push(y);
        if (row < rows - 1) {
            y += nodeHeight + Math.max(spacing.x12, laneOf(lanes.below[row]) + laneOf(lanes.above[row + 1]));
        }
    }
    const height = y + nodeHeight + laneOf(lanes.below[rows - 1]) + margin;
    if (!width) return { height, width: 0, boxes: {}, edges: [] };

    // Columns: the same for the arcs and labels beside a column; the nodes share what is left.
    const side = (column, which) =>
        lanes[which][column] ? lanes[which][column] * step + labelWidth(lanes[`${which}Label`][column]) : 0;
    let reserved = margin * 2 + side(0, 'left') + side(columns - 1, 'right');
    for (let column = 0; column < columns - 1; column += 1) {
        reserved += Math.max(spacing.x10, side(column, 'right') + side(column + 1, 'left'));
    }
    // A node never narrower than a label of a word or two beside its icon; the drawing grows instead.
    const nodeWidth = Math.max(spacing.x20 + spacing.x10, (width - reserved) / columns);
    const columnLeft = [];
    let x = margin + side(0, 'left');
    for (let column = 0; column < columns; column += 1) {
        columnLeft.push(x);
        if (column < columns - 1) {
            x += nodeWidth + Math.max(spacing.x10, side(column, 'right') + side(column + 1, 'left'));
        }
    }

    const boxes = Object.fromEntries(
        nodes.map((node) => [
            node.id,
            { x: columnLeft[node.column], y: rowTop[node.row], width: nodeWidth, height: nodeHeight },
        ])
    );

    const arrowSize = spacing.x2;
    const drawn = routes.map(({ edge, pair, kind, depth }) => {
        const a = boxes[pair.first.id];
        const b = boxes[pair.second.id];
        const reach = (depth * step) / APEX;
        let start;
        let end;
        let c1;
        let c2;
        let label;
        if (kind === 'above') {
            start = { x: a.x + a.width * 0.75, y: a.y };
            end = { x: b.x + b.width * 0.25, y: b.y };
            c1 = { x: start.x, y: a.y - reach };
            c2 = { x: end.x, y: b.y - reach };
            label = { x: (start.x + end.x) / 2, y: a.y - depth * step - spacing.x1, anchor: 'middle' };
        } else if (kind === 'below') {
            start = { x: b.x + b.width * 0.25, y: b.y + b.height };
            end = { x: a.x + a.width * 0.75, y: a.y + a.height };
            c1 = { x: start.x, y: start.y + reach };
            c2 = { x: end.x, y: end.y + reach };
            label = { x: (start.x + end.x) / 2, y: start.y + depth * step + labelHeight, anchor: 'middle' };
        } else if (kind === 'right') {
            start = { x: a.x + a.width, y: a.y + a.height * 0.75 };
            end = { x: b.x + b.width, y: b.y + b.height * 0.25 };
            c1 = { x: start.x + reach, y: start.y };
            c2 = { x: end.x + reach, y: end.y };
            // Parallel labels stack one line apart, so two arcs of a side never set their labels on one line.
            label = {
                x: start.x + depth * step + spacing.x1,
                y: (start.y + end.y) / 2 + fontSize / 2 + (depth - 1) * labelHeight,
                anchor: 'start',
            };
        } else if (kind === 'left') {
            start = { x: b.x, y: b.y + b.height * 0.25 };
            end = { x: a.x, y: a.y + a.height * 0.75 };
            c1 = { x: start.x - reach, y: start.y };
            c2 = { x: end.x - reach, y: end.y };
            label = {
                x: start.x - depth * step - spacing.x1,
                y: (start.y + end.y) / 2 + fontSize / 2 + (depth - 1) * labelHeight,
                anchor: 'end',
            };
        } else {
            const from = boxes[edge.from];
            const to = boxes[edge.to];
            const centre = (box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
            start = exitOf(from, centre(to));
            end = exitOf(to, centre(from));
            label = {
                x: (start.x + end.x) / 2 + spacing.x2,
                y: (start.y + end.y) / 2 + fontSize / 2,
                anchor: 'start',
            };
        }
        const path = c1
            ? `M ${round(start.x)} ${round(start.y)} C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(
                  c2.y
              )} ${round(end.x)} ${round(end.y)}`
            : `M ${round(start.x)} ${round(start.y)} L ${round(end.x)} ${round(end.y)}`;
        return {
            id: edge.id,
            path,
            arrow: arrowOf(c2 ?? start, end, arrowSize),
            label: { x: round(label.x), y: round(label.y), anchor: label.anchor },
        };
    });

    return { height, width: Math.max(width, reserved + nodeWidth * columns), boxes, edges: drawn };
};

export default stateFlowLayout;
