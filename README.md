# minty for foobar2k

![](https://preview.redd.it/nqy74ohzr1o91.png?width=1920&format=png&auto=webp&s=d0040b52e8d4ce18da521f47a6d74c676209e334)

minty is a theme for foobar2k leaning on the Columns UI, Panel Stack Splitter and Spider Monkey Panel components.

## Installation

This theme is currently configured for 1.6 stable versions of foobar. I haven't yet got around to trying 2.0 versions of foobar yet.

0. Close foobar.
1. Download the [github repository](https://github.com/okivs/minty-foobar/archive/refs/heads/main.zip).
2. Copy `foo-components` and `foo_spider_monkey_panel/packages` to your foobar profile directory.
    - For standard installations this is at `Users\username\AppData\Roaming\foobar2000`
3. Open foobar and select Columns UI or enable it via File > Preferences > Display, if it's not already.
4. In File > Preferences > Display > Columns UI > Main, select `Import Configuration` and import `minty.fcl` from the minty folder.

## Configuring the waveform seekbar

To configure the waveform seekbar:

0. Right click on the waveform seekbar > Configure (you may have to start playing a song to initialize it).
1. Choose direct3d frontend.
2. Open `Frontend settings...` and paste the raw contents of [waveform-seekbar.cpp](https://github.com/okivs/minty-foobar/blob/main/minty/waveform-seekbar.cpp).
3. In `Downmix display` dropdown, select `Mix-down to mono`
4. For my particular theme I use these colors:
    - Background: rgb 49, 49, 46
    - Foreground: rgb 74, 72, 68
    - Highlight: rgb 0, 255, 158

