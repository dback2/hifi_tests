//
// Created by Bradley Austin Davis on 2016/12/12
// Copyright 2013-2016 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
/*global print, Resources, Test, MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, Audio, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Paths, Clipboard, Settings, XMLHttpRequest, randFloat, randInt */
/*global ColorIndicator */

'use strict';

Script.include("./BenchmarkLib.js");
Resources.overrideUrlPrefix(TEST_ROOT, Script.resolvePath(".."));

var TRACE_TOOLBAR = "com.highfidelity.interface.toolbar.trace";
var TRACE_ICON = Script.resolvePath("../assets/traceButton.png"); 
var TRACE_NAME_BASE = "trace-";
var TRACE_NAME = "trace-{DATE}_{TIME}";
var TRACE_DURATION = 30;

var traceCounter = 0;

var traceActive = false;
var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
var button = tablet.addButton({
    icon: TRACE_ICON,
    activeIcon: TRACE_ICON,
    text: "toggleTrace",
    sortOrder: 1
});

function stopTrace() {
    if (!traceActive) {
        return;
    }
    traceActive = false;
    button.editProperties({isActive: traceActive});
    Test.stopTracing("traces/" + TRACE_NAME + ".json.gz");
}

function startTrace() {
    if (traceActive) {
        return;
    }
	
    TRACE_NAME = TRACE_NAME_BASE + traceCounter;
	traceCounter++;

    traceActive = true;
    button.editProperties({isActive: traceActive});
    print("QQQ starting trace " + TRACE_NAME + " for " + TRACE_DURATION + " seconds");
    Test.startTracing("trace.*=true");
	//Test.startTracing("trace.*=false\ntrace.render*=true\ntrace.render_detail*=true\ntrace.simulation=true\ntrace.workload=true\ntrace.app=true");
    if (TRACE_DURATION > 0) {
        Script.setTimeout(function(){
			stopTrace();
            startTrace();
        }, TRACE_DURATION * 1000);
    }
}

function traceToggle() {
    startTrace();
}

function onClicked() {
    traceToggle();
}

button.clicked.connect(onClicked);

print("QQQ trace script! done init");
