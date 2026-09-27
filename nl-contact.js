/* nl-contact.js - the contact form + the "Questions? Text us" bubble (2026-09-27).
   Everything goes straight to the Next Level Portal (Leads & sales), not to ZenPlanner / Engage. */
(function () {
    'use strict';
    var ENDPOINT = 'https://nlbjj.com/portal/web_lead.php';
    var PHONE = '+19035008290', PHONE_PRETTY = '(903) 500-8290';
    var SMS_BODY = 'Hi! I have a question about classes at Next Level Jiu-Jitsu.';
    var CONSENT = 'Yes, text me. I agree to receive text messages from Next Level Jiu-Jitsu Sherman about my tour, trial and classes. ' +
        'Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. See our <a href="privacy-policy.html">Privacy Policy</a>.';
    var t0 = Date.now();
    var page = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/i, '') || 'index';

    function el(tag, attrs, html) {
        var e = document.createElement(tag);
        for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
        if (html != null) e.innerHTML = html;
        return e;
    }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function digits(s) { var d = String(s || '').replace(/\D+/g, ''); if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1); return d; }
    function smsHref() { return 'sms:' + PHONE + '?&body=' + encodeURIComponent(SMS_BODY); }
    function isPhone() { return window.matchMedia && window.matchMedia('(max-width: 768px)').matches && ('ontouchstart' in window || navigator.maxTouchPoints > 0); }

    function wire(form) {
        if (form.getAttribute('data-nl-wired')) return;
        form.setAttribute('data-nl-wired', '1');
        var status = form.querySelector('.nl-status');
        var btn = form.querySelector('.nl-send');
        var btnText = btn ? btn.textContent : '';
        function say(msg, bad) { if (!status) return; status.textContent = msg || ''; status.className = 'nl-status' + (bad ? ' nl-err' : ''); }
        form.addEventListener('input', function (ev) { if (ev.target && ev.target.classList) ev.target.classList.remove('nl-bad'); if (status && status.classList.contains('nl-err')) say(''); });
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var f = form.elements;
            var name = (f.name.value || '').trim(), phone = (f.phone.value || '').trim(), email = f.email ? (f.email.value || '').trim() : '';
            if (name.length < 2) { f.name.classList.add('nl-bad'); f.name.focus(); return say('Please add your name.', true); }
            if (!phone && !email) { f.phone.classList.add('nl-bad'); f.phone.focus(); return say('Please add a phone number' + (f.email ? ' or an email' : '') + ' so we can reach you.', true); }
            if (phone && digits(phone).length !== 10) { f.phone.classList.add('nl-bad'); f.phone.focus(); return say('That phone number does not look right - please type all 10 digits.', true); }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { f.email.classList.add('nl-bad'); f.email.focus(); return say('That email address does not look right - please check it.', true); }
            var data = new URLSearchParams();
            for (var i = 0; i < form.elements.length; i++) {
                var x = form.elements[i];
                if (!x.name || x.disabled) continue;
                if ((x.type === 'checkbox' || x.type === 'radio') && !x.checked) continue;
                data.append(x.name, x.value);
            }
            data.set('ajax', '1');
            data.set('t', String(Math.round((Date.now() - t0) / 1000)));
            data.set('page', page);
            data.set('kind', form.getAttribute('data-kind') || 'form');
            if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
            say('');
            fetch(ENDPOINT, { method: 'POST', body: data, mode: 'cors', credentials: 'omit' })
                .then(function (r) { return r.json(); })
                .then(function (j) {
                    if (j && j.ok) {
                        var done = el('div', { 'class': 'nl-done', role: 'status' },
                            '<h4>Message sent!</h4><p>' + esc(j.msg) + '</p>' +
                            '<p>In a hurry? Text or call <a href="tel:' + PHONE + '">' + PHONE_PRETTY + '</a>.</p>');
                        form.parentNode.replaceChild(done, form);
                        try { if (window.gtag) window.gtag('event', 'generate_lead', { method: 'website ' + (form.getAttribute('data-kind') || 'form') }); } catch (e) { }
                        try { if (window.fbq) window.fbq('track', 'Lead'); } catch (e) { }
                    } else {
                        say((j && j.msg) || 'Something went wrong. Please call or text us at ' + PHONE_PRETTY + '.', true);
                        if (btn) { btn.disabled = false; btn.textContent = btnText; }
                    }
                })
                .catch(function () {
                    say('We could not send that. Please call or text us at ' + PHONE_PRETTY + '.', true);
                    if (btn) { btn.disabled = false; btn.textContent = btnText; }
                });
        });
    }

    function miniForm() {
        var f = el('form', { 'class': 'nl-form', action: ENDPOINT, method: 'post', 'data-nl-form': '', 'data-kind': 'chat', novalidate: '' },
            '<label>Your name<input type="text" name="name" autocomplete="name" maxlength="60" required></label>' +
            '<label>Mobile phone<input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="(903) 555-1234"></label>' +
            '<label>Email <span class="nl-opt">(if no phone)</span><input type="email" name="email" autocomplete="email" maxlength="120"></label>' +
            '<label>Your question<textarea name="message" rows="3" maxlength="1500" placeholder="Ask us anything - classes, ages, prices..."></textarea></label>' +
            '<label class="nl-consent"><input type="checkbox" name="consent" value="1"><span>' + CONSENT + '</span></label>' +
            '<div class="nl-hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
            '<button type="submit" class="btn btn-primary nl-send">Send</button>' +
            '<p class="nl-status" role="status" aria-live="polite"></p>');
        wire(f);
        return f;
    }

    function bubble() {
        if (document.querySelector('.nl-bub')) return;
        var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
        var b = el('button', { type: 'button', 'class': 'nl-bub', 'aria-expanded': 'false', 'aria-controls': 'nl-pan' }, icon + '<span>Questions? Text us</span>');
        var p = el('div', { id: 'nl-pan', 'class': 'nl-pan', role: 'dialog', 'aria-label': 'Message Next Level Jiu-Jitsu', hidden: '' });
        var hd = el('div', { 'class': 'nl-pan-hd' }, '<div><strong>Next Level Jiu-Jitsu Sherman</strong><small>We usually answer within minutes</small></div>');
        var x = el('button', { type: 'button', 'class': 'nl-x', 'aria-label': 'Close' }, '&times;');
        hd.appendChild(x);
        var bd = el('div', { 'class': 'nl-pan-bd' });
        p.appendChild(hd); p.appendChild(bd);
        function fill() {
            bd.innerHTML = '';
            if (isPhone()) {
                bd.appendChild(el('a', { 'class': 'nl-big', href: smsHref() }, 'Text us now'));
                bd.appendChild(el('a', { 'class': 'nl-big nl-ghost', href: 'tel:' + PHONE }, 'Call ' + PHONE_PRETTY));
                bd.appendChild(el('p', { 'class': 'nl-fine' }, 'By texting us you agree to receive text messages from Next Level Jiu-Jitsu Sherman about your tour, trial and classes. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.'));
                var more = el('button', { type: 'button', 'class': 'nl-link' }, 'Or leave us a message here');
                more.addEventListener('click', function () { bd.innerHTML = ''; var mf = miniForm(); bd.appendChild(mf); var n = mf.querySelector('input[name="name"]'); if (n) n.focus(); });
                bd.appendChild(more);
            } else {
                bd.appendChild(miniForm());
                bd.appendChild(el('p', { 'class': 'nl-or' }, 'Prefer to text? <a href="' + smsHref() + '">' + PHONE_PRETTY + '</a>'));
            }
        }
        function open() { if (!bd.firstChild) fill(); p.hidden = false; b.setAttribute('aria-expanded', 'true'); var n = p.querySelector('input[name="name"], .nl-big'); if (n) n.focus(); }
        function close() { p.hidden = true; b.setAttribute('aria-expanded', 'false'); b.focus(); }
        b.addEventListener('click', open);
        x.addEventListener('click', close);
        document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !p.hidden) close(); });
        document.body.appendChild(b);
        document.body.appendChild(p);
    }

    function start() {
        var forms = document.querySelectorAll('form[data-nl-form]');
        for (var i = 0; i < forms.length; i++) wire(forms[i]);
        bubble();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
