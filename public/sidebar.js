/* exported Show*/
'use strict';

var sections = document.getElementsByClassName('mainsection');

/**
 * Shows the Selected Section from Sidebar and hides other sections.
 * Hides other section
 * 
 * @param {HTMLLinkElement} section - This should have `data-sectionname` attribute mentioning the name of Section to show 
 */
function Show(section) {
    for (var index = 0; index < sections.length; index++) {
        var element = sections[index];
        element.style.display = 'none';
    }
    sections[section.getAttribute('data-sectionname')].style.display='block';
}