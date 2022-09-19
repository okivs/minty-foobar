//window.DefineScript('MainMenuManager All-In-One', { author: 'YBStone / T.P Wang / marc2003' });
include('docs/Flags.js');
include('docs/Helpers.js');

let hlColor = RGB(240, 240, 240);
let fontColor = window.GetColourCUI(1);
let bgColor = window.GetColourCUI(4);
let font = gdi.Font("Segoe MDL2 Assets", 16);

console.log(window.Width, window.Height)

function on_paint(gr) {
    gr.FillSolidRect(0, 0, 30, 30, bgColor)
    gr.GdiDrawText("\uE713", font, fontColor, 0, 0, 30, 30, 0x00000020|DT_VCENTER|DT_CENTER|0x00040000)
}

function on_mouse_move(x, y) {
    if (x > 0 && x < window.Width && y > 0 && y < window.Height) {
        fontColor = hlColor;
        window.Repaint();
    }
}

function on_mouse_leave() {
    fontColor = window.GetColourCUI(1);
    window.Repaint();
}

function on_mouse_lbtn_up(x, y) {
    if (x > 0 && x < window.Width && y > 0 && y < window.Height) {
        menu(x, y);
    }
}

function on_mouse_rbtn_up(x, y) {
    if (x > 0 && x < window.Width && y > 0 && y < window.Height) {
        menu(x, y);
    }
    return true;
}

function menu(x, y) {
    let basemenu = window.CreatePopupMenu();
    let contextman = fb.CreateContextMenuManager();
    contextman.InitNowPlaying();
    
    let child1 = window.CreatePopupMenu(); //File
    let child2 = window.CreatePopupMenu(); //Edit
    let child3 = window.CreatePopupMenu(); //View
    let child4 = window.CreatePopupMenu(); //Playback
    let child5 = window.CreatePopupMenu(); //Library
    let child6 = window.CreatePopupMenu(); //Help
    let child7 = window.CreatePopupMenu(); //Now playing
    
    let menuman1 = fb.CreateMainMenuManager();
    let menuman2 = fb.CreateMainMenuManager();
    let menuman3 = fb.CreateMainMenuManager();
    let menuman4 = fb.CreateMainMenuManager();
    let menuman5 = fb.CreateMainMenuManager();
    let menuman6 = fb.CreateMainMenuManager();
    
    // MF_STRING is defined in docs/Flags.js
    child1.AppendTo(basemenu, MF_STRING, 'File');
    child2.AppendTo(basemenu, MF_STRING, 'Edit');
    child3.AppendTo(basemenu, MF_STRING, 'View');
    child4.AppendTo(basemenu, MF_STRING, 'Playback');
    child5.AppendTo(basemenu, MF_STRING, 'Library');
    child6.AppendTo(basemenu, MF_STRING, 'Help');
    
    if (fb.IsPlaying) {
        basemenu.AppendMenuSeparator();
        child7.AppendTo(basemenu, MF_STRING, 'Now Playing');
    }
    
    basemenu.AppendMenuSeparator();
    basemenu.AppendMenuItem(MF_STRING, 2000, "Configure...")
    
    menuman1.Init('file');
    menuman2.Init('edit');
    menuman3.Init('View');
    menuman4.Init('playback');
    menuman5.Init('library');
    menuman6.Init('help');
    
    menuman1.BuildMenu(child1, 1, 200);
    menuman2.BuildMenu(child2, 201, 200);
    menuman3.BuildMenu(child3, 401, 200);
    menuman4.BuildMenu(child4, 601, 300);
    menuman5.BuildMenu(child5, 901, 300);
    menuman6.BuildMenu(child6, 1201, 100);
    
    contextman.InitNowPlaying();
    contextman.BuildMenu(child7, 1301);
    const ret = basemenu.TrackPopupMenu(x, y);

    if (ret >= 1 && ret < 201) {
        menuman1.ExecuteByID(ret - 1);
    }
    else if (ret >= 201 && ret < 401) {
        menuman2.ExecuteByID(ret - 201);
    }
    else if (ret >= 401 && ret < 601) {
        menuman3.ExecuteByID(ret - 401);
    }
    else if (ret >= 601 && ret < 901) {
        menuman4.ExecuteByID(ret - 601);
    }
    else if (ret >= 901 && ret < 1201) {
        menuman5.ExecuteByID(ret - 901);
    }
    else if (ret >= 1201 && ret < 1301) {
        menuman6.ExecuteByID(ret - 1201);
    }
    else if (ret >= 1301 && ret < 1999) {
        contextman.ExecuteByID(ret - 1301);
    }
    else if (ret === 2000) {
        window.ShowConfigureV2();
    }
}
