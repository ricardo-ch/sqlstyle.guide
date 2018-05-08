---
layout: nil
---

{% include static/anchor.min.js %}
anchors.add('h2,h3,h4,h5,h6');

document.addEventListener('DOMContentLoaded', () => {
    /*
     * ScrollTo code
     */
    document.querySelectorAll('a[href^="#"]')
        .forEach(x => x.addEventListener('click', e => {
            var targetHash = e.target.hash.replace(/:/g,'\\$&'),
                targetDecoded = decodeURI(targetHash),
                targetId = targetDecoded.replace('#', ''),
                target = document.getElementById(targetId || 'translation-bar');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }));
});

