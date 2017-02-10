# API Blocking Firefox Extension

## Usage
The extension reads a comma separated list of standards to block from the
`FF_STANDARDS` environment variable.  The standard IDs are given below.

With this extension installed, Firefox will only run when the `FF_STANDARDS`
variable is present.

For example, to run Firefox with the **Battery Status API** and **Beacon**
APIs disabled, you might do the following:

`FF_STANDARDS=1,2 <path to firefox>`


## Standards Table

Standard ID | Standard Name | Standard Abbreviation
----------- | ------------- | ----------------------
1 | BA | Battery Status API  
2 | BE | Beacon  
3 | CO | Console API  
4 | CSS-CR | CSS Conditional Rules Module Level 3  
5 | CSS-FO | CSS Font Loading Module Level 3  
6 | CSS-OM | CSS Object Model (CSSOM)  
7 | CSS-VM | CSSOM View Module  
8 | DO | DeviceOrientation Event Specification  
9 | DU | Directory Upload  
10 | DOM1 | Document Object Model (DOM) Level 1 Specification  
11 | DOM2-C | Document Object Model (DOM) Level 2 Core Specification  
12 | DOM2-E | Document Object Model (DOM) Level 2 Events Specification  
13 | DOM2-H | Document Object Model (DOM) Level 2 HTML Specification  
14 | DOM2-S | Document Object Model (DOM) Level 2 Style Specification  
15 | DOM2-T | Document Object Model (DOM) Level 2 Traversal and Range Specification  
16 | DOM3-C | Document Object Model (DOM) Level 3 Core Specification  
17 | DOM3-X | Document Object Model (DOM) Level 3 XPath Specification  
18 | DOM | DOM  
19 | DOM-PS | DOM Parsing and Serialization  
20 | E | Encoding  
21 | EME | Encrypted Media Extensions  
22 | EC | execCommand  
23 | F | Fetch  
24 | FA | File API  
25 | FULL | Fullscreen API  
26 | GP | Gamepad  
27 | GEO | Geolocation API Specification  
28 | GIM | Geometry Interfaces Module Level 1  
29 | HRT | High Resolution Time Level 2  
30 | H-B | HTML 9.6 Broadcasting to other browsing contexts
31 | H-C | HTML 4.12.4 The canvas element
32 | H-WS | HTML 9.3 Web Sockets
33 | H-CM | HTML 9.5 Channel Messaging
34 | H-P | HTML 8.6.1.5 Plugins
35 | H-WW | HTML 10 Web Workers
36 | H-WB | HTML 11 Web Storage
37 | HTML | HTML  
38 | H-HI | HTML 7.5.2 History Interface
39 | HTML5 | HTML 5  
40 | HTML51 | HTML 5.1  
41 | H-E | HTML Editing APIs  
42 | IDB | Indexed Database API  
43 | MCS | Media Capture and Streams  
44 | MCD | Media Capture from DOM Elements  
45 | MSE | Media Source Extensions  
46 | MSR | MediaStream Recording  
47 | NT | Navigation Timing  
48 | WN | Web Notifications  
49 | PV | Page Visibility (Second Edition)  
50 | PT | Performance Timeline  
51 | PT2 | Performance Timeline Level 2  
52 | PL | Pointer Lock  
53 | PE | Proximity Events  
54 | RT | Resource Timing  
55 | SVG | Scalable Vector Graphics (SVG) 1.1 (Second Edition)  
56 | SEL | Selection API  
57 | SLC | Selectors API Level 1  
58 | SW | Service Workers  
59 | SD | Shadow DOM  
60 | SO | The Screen Orientation API  
61 | TC | Timing control for script-based animations  
62 | TPE | Tracking Preference Expression (DNT)  
63 | UIE | UI Events Specification  
64 | URL | URL  
65 | UTL | User Timing Level 2  
66 | V | Vibration API  
67 | DOM4 | W3C DOM4  
68 | WEBA | Web Audio API  
69 | WCR | Web Cryptography API  
70 | WEBGL | WebGL Specification  
71 | WRTC | WebRTC 1.0: Real-time Communication Between Browser  
72 | WEBVTT | WebVTT: The Web Video Text Tracks Format  
73 | AJAX | XMLHttpRequest  
74 | ALS | Ambient Light Sensor API  
76 | NS | Non-Standard  
