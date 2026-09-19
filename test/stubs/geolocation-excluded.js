'use strict';

/* A-3 — LA POSICIÓN QUEDA FUERA DE LA SUITE, Y SE DICE (decisión del dueño, 2026-09-19).
 *
 * POR QUÉ HAY UN STUB. `react-native-geolocation-service` construye un
 * `NativeEventEmitter` AL IMPORTARSE, y sin código nativo eso revienta con
 * «requires a non-null argument». No es un fallo de la prueba: la biblioteca no
 * se puede cargar fuera de un dispositivo. Como el barril de componentes la
 * arrastra (`src/Geoposition/utils.js`), el barril entero no cargaba — y ése era
 * el último eslabón de A-3.
 *
 * POR QUÉ ESTE STUB NO SIMULA NADA. Se eligió EXCLUIR el módulo, no doblarlo: un
 * mock que devuelve una posición fija haría pasar pruebas que dependen de la
 * posición sin que nadie haya decidido qué posición es la correcta, y eso es
 * peor que no cubrirlas. Aquí cada método LANZA con su razón, así que:
 *
 *   * el barril carga y las 131 pruebas que no tocan la posición corren;
 *   * cualquier prueba que SÍ dependa de la posición falla nombrando el hueco,
 *     en vez de pasar por una posición inventada.
 *
 * QUÉ CERRARÍA ESTO DE VERDAD: que la biblioteca publique su propio setup de
 * pruebas, como hace `@rnmapbox/maps` —cuyo `setup-jest` esta suite ya usa— o
 * que la capa de posición de este repositorio tenga un puerto propio que sí se
 * pueda doblar sin inventar.
 */

const excluded = (method) => () => {
    throw new Error(
        `react-native-geolocation-service está EXCLUIDO de la suite (A-3): `
        + `nadie decidió qué debe ver la prueba al llamar a \`${method}\`. `
        + 'Si necesitas cubrir la posición, dale un puerto propio a esta capa '
        + 'o usa el setup de pruebas que publique la biblioteca — no un mock inventado aquí.',
    );
};

module.exports = {
    getCurrentPosition: excluded('getCurrentPosition'),
    watchPosition: excluded('watchPosition'),
    clearWatch: excluded('clearWatch'),
    stopObserving: excluded('stopObserving'),
    requestAuthorization: excluded('requestAuthorization'),
    setRNConfiguration: excluded('setRNConfiguration'),
    default: {
        getCurrentPosition: excluded('getCurrentPosition'),
        watchPosition: excluded('watchPosition'),
        clearWatch: excluded('clearWatch'),
        stopObserving: excluded('stopObserving'),
        requestAuthorization: excluded('requestAuthorization'),
        setRNConfiguration: excluded('setRNConfiguration'),
    },
};
