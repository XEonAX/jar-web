/* jshint browser: true */
'use strict';

var sections = document.getElementsByClassName('mainsection');

function Show(section) {
    for (var index = 0; index < sections.length; index++) {
        var element = sections[index];
        element.style.display = 'none';
    }
    sections[section.getAttribute('data-sectionname')].style.display='block';
}