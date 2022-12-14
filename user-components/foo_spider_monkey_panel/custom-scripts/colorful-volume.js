'use strict';

window.DefineScript('Volume', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\volume.js');

let volume = new _volume(0, 0, 0, 0);
volume.c1 = window.GetColourCUI(5); // bg color - 'Selected Item background' in CUI
volume.c2 = window.GetColourCUI(4); // bar color - 'Item foreground' in CUI

function on_size() {
	volume.w = window.Width;
	volume.h = window.Height;
}

function on_colours_changed() {
    volume.c1 = window.GetColourCUI(5);
    volume.c2 = window.GetColourCUI(4);
    window.Repaint();
}

function on_paint(gr) {
	gr.FillSolidRect(volume.x, volume.y, volume.w, volume.h, volume.c1);
	gr.FillSolidRect(volume.x, volume.y, volume.pos(), volume.h, volume.c2);
}

function on_mouse_lbtn_down(x, y) {
	volume.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	volume.lbtn_up(x, y);
}

function on_mouse_move(x, y) {
	volume.move(x, y);
}

function on_mouse_wheel(s) {
	volume.wheel(s);
}

function on_volume_change() {
	volume.volume_change();
}
