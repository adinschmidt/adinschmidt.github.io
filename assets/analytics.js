(() => {
    const analytics = window.posthog;
    const isProduction = ['adinschmidt.com', 'www.adinschmidt.com'].includes(location.hostname);
    const isTest = new URLSearchParams(location.search).get('analytics_test') === '1';
    if (!analytics || (!isProduction && !isTest)) return;

    analytics.init('phc_zNBNhVkMHxG5TsL5XmS4DnDWANWdTHMysn34qkGsK3cx', {
        api_host: 'https://us.i.posthog.com',
        ui_host: 'https://us.posthog.com',
        defaults: '2026-05-30',
        persistence: 'localStorage',
        person_profiles: 'never',
        autocapture: false,
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: true,
        disable_surveys: true,
        capture_heatmaps: false,
        capture_dead_clicks: false,
        capture_performance: false,
        capture_exceptions: false,
        respect_dnt: true,
        loaded(instance) {
            instance.register({ website_design: 'space', analytics_test: isTest });
        },
    });

    // Delegation also covers the PDF viewer's dynamically inserted fallback link.
    document.addEventListener('click', (event) => {
        const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
        if (!link) return;

        const destination = new URL(link.href);
        let name;
        if (destination.origin === location.origin && destination.pathname === '/assets/resume.pdf') {
            name = 'resume_clicked';
        } else if (link.closest('#projects') && destination.protocol === 'https:') {
            name = 'project_clicked';
        } else if (destination.protocol === 'mailto:') {
            name = 'contact_clicked';
        } else if (['github.com', 'www.linkedin.com'].includes(destination.hostname)) {
            name = 'social_link_clicked';
        } else {
            return;
        }

        analytics.capture(name, {
            destination: destination.protocol === 'mailto:' ? 'mailto' : destination.origin + destination.pathname,
            link_label: link.getAttribute('aria-label') || link.textContent.trim(),
            link_location: link.closest('nav') ? 'navigation' : link.closest('footer') ? 'footer' : 'content',
            download_requested: link.hasAttribute('download'),
        });
    });
})();
