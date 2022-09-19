include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');

//let colorFont = _RGB(255, 255, 255);
let colorFont = window.GetColourCUI(1);
let colorBG = window.GetColourCUI(4);
let font = gdi.Font('Quicksand Medium',14,0);

let len;
let size;
let count;

let viewingPlaylist;
let playingPlaylist;
let playStatus;

function makeContextMenu(x, y) {
    let contextManager = fb.CreateContextMenuManager();
    let baseMenu = window.CreatePopupMenu();
    let plMenu = window.CreatePopupMenu();
    let plStartAt = 7; // id that playlists start at, to ensure they should never overlaps with menu ids
    
    /* context menu indexes 1-based because 0 refers to clicking out of the menu,
       playlist list is 0-indexed */
    baseMenu.AppendMenuItem(MF_STRING, 1, "Configure...");
    baseMenu.AppendMenuItem(MF_STRING, 2, "Edit panel script...");
    baseMenu.AppendMenuSeparator();
    
    plMenu.AppendMenuItem(MF_STRING, 3, "Create new playlist");
    plMenu.AppendMenuItem(MF_STRING, 4, "Load playlist from file");
    plMenu.AppendMenuItem(MF_STRING, 5, "Rename current playlist");
    plMenu.AppendMenuSeparator();
    plMenu.AppendMenuItem(MF_STRING, 6, "Remove current playlist");
    plMenu.AppendTo(baseMenu, MF_STRING, "Playlist...")
	
    if (plman.PlaylistCount > 0) {
	baseMenu.AppendMenuSeparator();
        for (let i = 0; i < plman.PlaylistCount; i++) {
            let listName = plman.GetPlaylistName(i);
            let listCount = plman.PlaylistItemCount(i);
            i === plman.ActivePlaylist ? baseMenu.AppendMenuItem(0x00000008, i + plStartAt, `${listName} \t(${listCount})`)
                                       : baseMenu.AppendMenuItem(MF_STRING, i + plStartAt, `${listName} \t(${listCount})`);
        }
    }
    
    const idx = baseMenu.TrackPopupMenu(x, y);
    let newName = "";
    switch (true) {
        case (idx <= 0):
            return;
        case (idx === 1):
            window.ShowConfigureV2()
            break;
        case (idx === 2):
            window.EditScript() 
            break;
        case (idx === 3):
            try {
                newName = utils.InputBox(0, "Enter a name for the new playlist:", "Create new playlist", "", true);
            
                // Create new playlist at end of playlist list and then go to it.
                plman.CreatePlaylist(plman.PlaylistCount + 1, newName);
                plman.ActivePlaylist = plman.PlaylistCount - 1;
            } catch { return; }
            break;
        case (idx === 4):
            fb.LoadPlaylist()
            break;
        case (idx === 5):
            try {
                newName = utils.InputBox(0, 
                                         `Enter a new name for ${plman.GetPlaylistName(plman.ActivePlaylist)}:`, 
                                         "Rename current playlist", "", true);
                plman.RenamePlaylist(plman.ActivePlaylist, newName)
                getPlaylistInfo();
            } catch { return; }
            break;
        case (idx === 6):
            plman.RemovePlaylistSwitch(plman.ActivePlaylist);
            break;
        case (idx > 6):
            plman.ActivePlaylist = idx - plStartAt;
            break;
        default:
            return;
    }
}

function checkViewState() {
    if (fb.GetNowPlaying() == null) {

        return `${plman.GetPlaylistName(activePlaylist)}`;

    } else if (playingPlaylist === viewingPlaylist && fb.IsPaused) {

        return `⏸︎ ${playingPlaylist}`;

    } else if (playingPlaylist === viewingPlaylist && fb.IsPlaying) {

        return `⏯︎ ${playingPlaylist}`;

    } else if (playingPlaylist !== viewingPlaylist) {

        let state = fb.IsPaused ? `⏸︎ ${playingPlaylist}` : `⏯︎ ${playingPlaylist}`;
        return `${state} • ${plman.GetPlaylistName(activePlaylist)}`;

    } else {
        return;
    }
}

function getPlaylistInfo() {
    activePlaylist = plman.ActivePlaylist;
    playlistItemCount = plman.PlaylistItemCount(activePlaylist);
    
    viewingPlaylist = plman.GetPlaylistName(activePlaylist);

    playStatus = checkViewState();
    window.Repaint();
}
getPlaylistInfo();

// ---- on playlist state

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
    colorFont = window.GetColourCUI(1);
    colorBG = window.GetColourCUI(4);
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

// ----

function on_size() {
	w = window.Width;
	h = window.Height;
}

function on_mouse_lbtn_up(x, y) {
    makeContextMenu(x, y);
}

function on_mouse_rbtn_up(x, y) {
    makeContextMenu(x, y);
    return true;
}

function on_paint(gr) {
    let infoText;

    if (len && count > 0) {
        infoText = `${playStatus} (${playlistItemCount})  •  ${count} selected - ${len}`;
    } else {
        infoText = `${plman.GetPlaylistName(activePlaylist)} (${playlistItemCount})`;
    }
    
    gr.FillSolidRect(0, 0, w, h, colorBG);
    gr.GdiDrawText(infoText, font, colorFont, 6, 0, w - 12, h - 2, 0x00000020|DT_VCENTER|DT_CENTER|0x00040000);
}
