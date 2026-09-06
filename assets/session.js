/* ============================================================
   Swap the nav buttons when the visitor is already logged in.

   The site (dracusro.com) and the panel (panel.dracusro.com) are
   different origins, so this can only work if FluxCP's session
   cookie is scoped to the parent domain. In config/application.php:

       'SessionCookieDomain' => '.dracusro.com',

   Note the leading dot. Without it the cookie belongs to
   panel.dracusro.com alone and this file quietly does nothing,
   which is the correct fallback - people just see Log in.
   ============================================================ */

(function () {
  var cta = document.getElementById('nav-cta');
  if (!cta) return;

  // FluxCP names its session cookie in config. These are the usual ones.
  var NAMES = ['FLUX_SESSID', 'PHPSESSID', 'flux_sessid'];

  function loggedIn() {
    var jar = document.cookie;
    for (var i = 0; i < NAMES.length; i++) {
      if (jar.indexOf(NAMES[i] + '=') !== -1) return true;
    }
    return false;
  }

  if (!loggedIn()) return;

  var login = cta.querySelector('.js-login');
  var reg   = cta.querySelector('.js-register');

  if (login) login.remove();
  if (reg) {
    reg.textContent = 'Control panel';
    reg.setAttribute('href', cta.dataset.panel);
    reg.classList.add('js-panel');
  }
})();
