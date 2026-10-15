/* Runtime mínimo que substitui o motor do canvas: estado, bindings e eventos. */
(function () {
  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); }
  function str(v) { return v == null ? '' : String(v); }
  window.DCLogic = class DCLogic {
    constructor(props) { this.props = props || {}; this.state = this.state || {}; }
    setState(patch) {
      var p = typeof patch === 'function' ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, p);
      if (this.__render) this.__render();
    }
  };
  window.DC = {
    mount: function (Comp, props) {
      var c = new Comp(props);
      var tplAttrs = [];
      document.querySelectorAll('*').forEach(function (el) {
        Array.prototype.slice.call(el.attributes).forEach(function (a) {
          if (a.name.indexOf('data-tpl-') === 0) tplAttrs.push({ el: el, name: a.name.slice(9), tpl: a.value });
        });
      });
      var ifs = Array.prototype.slice.call(document.querySelectorAll('dc-if'));
      var texts = Array.prototype.slice.call(document.querySelectorAll('[data-text]'));
      var vals = {};
      c.__render = function () {
        vals = c.renderVals ? c.renderVals() : {};
        tplAttrs.forEach(function (t) {
          var whole = t.tpl.match(/^\{\{\s*([\w.]+)\s*\}\}$/);
          var v = whole ? get(vals, whole[1]) : t.tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (_, k) { return str(get(vals, k)); }).replace(/\s+/g, ' ').trim();
          if (v === false && whole && !/^aria-/.test(t.name)) { t.el.removeAttribute(t.name); return; }
          v = str(v);
          if (t.el.getAttribute(t.name) !== v) t.el.setAttribute(t.name, v);
        });
        ifs.forEach(function (el) { el.hidden = !get(vals, el.getAttribute('data-if')); });
        texts.forEach(function (el) { var v = str(get(vals, el.getAttribute('data-text'))); if (el.textContent !== v) el.textContent = v; });
      };
      document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-on-click]');
        if (!el) return;
        var fn = get(vals, el.getAttribute('data-on-click'));
        if (typeof fn === 'function') fn(e);
      });
      c.__render();
      document.querySelectorAll('[data-ref]').forEach(function (el) {
        var fn = get(vals, el.getAttribute('data-ref'));
        if (typeof fn === 'function') fn(el);
      });
      if (c.componentDidMount) c.componentDidMount();
      window.__dc = c;
    }
  };
})();
