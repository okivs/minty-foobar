include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');

colorFont = window.GetColourCUI(1);
colorBG = window.GetColourCUI(4);
var font = gdi.Font('Quicksand Medium',14,0);
var panel = new _panel();

var len;
var size;
var count;

var viewingPlaylist;
var playingPlaylist;
var playStatus;

// ---- on playlist state

function getPlaylistInfo() {
    activePlaylist = plman.ActivePlaylist;
    playlistItemCount = plman.PlaylistItemCount(activePlaylist);
    
    viewingPlaylist = plman.GetPlaylistName(activePlaylist);

    playStatus = checkViewState();
    window.Repaint();
}
getPlaylistInfo(); 

function on_playlist_switch() {
    getPlaylistInfo();
}

function on_playlist_items_added(playlist) {
    getPlaylistInfo();
}

function on_playlist_items_removed(playlist, new_count) {
    getPlaylistInfo();
}

function on_colours_changed() {
    colorFont = window.GetColourCUI(5);
    barColorBG = window.GetColourCUI(4);
    window.Repaint();
}

function on_selection_changed() {
    selected = fb.GetSelections();
    count = selected.Count;
    len = utils.FormatDuration(selected.CalcTotalDuration());
    size = utils.FormatFileSize(selected.CalcTotalSize());
    
    window.Repaint();
}

// ---- on playback state

function on_playback_starting() {
    playingPlaylist = plman.GetPlaylistName(plman.PlayingPlaylist);
    playStatus = checkViewState();
    window.Repaint();
}

function on_playback_pause() {
    playStatus = checkViewState();
    window.Repaint();
}

function on_playback_stop() {
    playStatus = checkViewState();
    window.Repaint();
}

function checkViewState() {
    if (fb.GetNowPlaying() == null) {

        return `${plman.GetPlaylistName(activePlaylist)}`;

    } else if (playingPlaylist === viewingPlaylist && fb.IsPaused) {

        return `▶️ ${playingPlaylist}`;

    } else if (playingPlaylist === viewingPlaylist && fb.IsPlaying) {

        return `▶️ ${playingPlaylist}`;

    } else if (playingPlaylist !== viewingPlaylist) {

        let state = fb.IsPaused ? `▶️ ${playingPlaylist}` : `▶️ ${playingPlaylist}`;
        return `${state} • ${plman.GetPlaylistName(activePlaylist)}`;

    } else {
        return;
    }
}

// ----

function on_size() {
	panel.size();
	w = panel.w;
	h = panel.h;
}

function on_paint(gr) {
    let infoText;

    if (len && count > 0) {
        infoText = `${playStatus} (${playlistItemCount})  •  ${count} selected - ${len}`;
    } else {
        infoText = `${plman.GetPlaylistName(activePlaylist)} (${playlistItemCount})`;
    }
    
    gr.FillSolidRect(0 , 0, w, h, colorBG);
    gr.GdiDrawText(infoText, font, colorFont, 6, 0, w - 12, h - 2, 0x00000020|DT_VCENTER|DT_CENTER|0x00040000);
}