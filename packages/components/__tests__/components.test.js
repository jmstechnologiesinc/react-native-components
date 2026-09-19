'use strict';

/* EL BARRIL, POR FIN CARGADO (A-3, 2026-09-19).
 *
 * ESTA PRUEBA ERA UN MARCADOR: `it('needs tests')`, sin cuerpo. Y no es que
 * nadie la hubiera escrito — es que NO PODIA CORRER: el barril arrastraba
 * `@rnmapbox/maps` y `react-native-geolocation-service`, que construyen codigo
 * nativo al importarse, asi que la suite fallaba antes de llegar a la primera
 * asercion. Un marcador que ademas no carga se lee como «pendiente» y es
 * «imposible»; la diferencia importa, porque la segunda no se arregla
 * escribiendo pruebas.
 *
 * Lo que la hizo posible, por orden: el `setup-jest` que publica la propia
 * `@rnmapbox/maps` (no un mock de esta casa), transpilar los paquetes hermanos
 * que publican ESM, y EXCLUIR la biblioteca de posicion — decision del dueno —
 * con un stub que lanza en vez de simular.
 *
 * QUE SE ASEVERA AQUI, y deliberadamente poco: que el barril CARGA y sirve lo
 * que dice servir. Un barril es una lista de reexportaciones; probar cada
 * componente es trabajo de cada componente, y ocho suites ya lo hacen.
 */

const components = require('../src');

describe('el barril de componentes', () => {
    it('carga y expone su superficie', () => {
        const exported = Object.keys(components);
        // No se fija un numero exacto: el barril crece, y una prueba que hay que
        // actualizar cada vez que alguien anade un componente se acaba borrando.
        expect(exported.length).toBeGreaterThan(20);
    });

    it('sirve los nombres que sus consumidores importan', () => {
        for (const name of ['List', 'Form', 'VendorList', 'CartList', 'styles']) {
            expect(`${name}:${name in components}`).toBe(`${name}:true`);
        }
    });

    it('A-3: la posicion esta EXCLUIDA, y llamarla lo dice en vez de inventar una', () => {
        // El hueco declarado. Si algun dia alguien doblara la biblioteca con una
        // posicion fija, esta prueba fallaria -- que es exactamente lo que se
        // quiere: esa decision se toma a proposito, no de pasada.
        // eslint-disable-next-line global-require
        const geo = require('react-native-geolocation-service');
        expect(() => geo.getCurrentPosition()).toThrow(/EXCLUIDO de la suite \(A-3\)/);
        expect(() => geo.watchPosition()).toThrow(/no un mock inventado/);
    });
});
