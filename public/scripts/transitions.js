// Sens des transitions de page (src/styles/transitions.css). Script classique,
// synchrone et minuscule : il doit s'exécuter avant le premier rendu de la
// page qui arrive, quand l'événement « pagereveal » est émis.
// - retour dans l'historique, ou page moins profonde : « back » ;
// - page plus profonde (plus de segments dans le chemin) : « deeper » ;
// - sinon : transition latérale par défaut.
(function () {
  'use strict';
  var depth = function (url) {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).length;
    } catch (e) {
      return 0;
    }
  };
  // Page quittée : ses promesses de transition peuvent aussi être rejetées
  window.addEventListener('pageswap', function (event) {
    var vt = event.viewTransition;
    if (!vt) return;
    vt.ready.catch(function () {});
    vt.finished.catch(function () {});
    if (vt.updateCallbackDone) vt.updateCallbackDone.catch(function () {});
  });
  window.addEventListener('pagereveal', function (event) {
    var vt = event.viewTransition;
    var nav = window.navigation;
    if (!vt) return;
    // Une transition sautée (onglet masqué, nouvelle navigation) n'est pas une erreur
    vt.ready.catch(function () {});
    vt.finished.catch(function () {});
    if (vt.updateCallbackDone) vt.updateCallbackDone.catch(function () {});
    if (!vt.types || !nav || !nav.activation || !nav.activation.from) return;
    var from = nav.activation.from;
    var entry = nav.activation.entry;
    if (nav.activation.navigationType === 'traverse' && from.index > entry.index) {
      vt.types.add('back');
      return;
    }
    var a = depth(from.url);
    var b = depth(entry.url);
    if (b > a) vt.types.add('deeper');
    else if (b < a) vt.types.add('back');
  });
})();
