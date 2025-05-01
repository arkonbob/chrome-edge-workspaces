"use strict";

import { PopupMessageHelper } from "./messages/popup-message-helper";
import { PageAddWorkspace } from "./pages/page-add-workspace";
import { PageSettings } from "./pages/page-settings";
import "./popup.css";
import { StorageHelper } from "./storage-helper";
import { Utils } from "./utils";
import { WorkspaceEntryLogic } from "./workspace-entry-logic";
import { WorkspaceStorage } from "./workspace-storage";

/**
 * This function is called when the popup is opened.
 * Setup the listeners for the buttons
 */
async function documentLoaded() {
   chrome.windows.onRemoved.addListener(windowRemoved);
   const workspaceStorage = await getWorkspaceStorage();
   
   document.getElementById("addWorkspace").addEventListener("click", addWorkspaceButtonClicked);
   document.getElementById("settings-button").addEventListener("click", settingsButtonClicked);

   WorkspaceEntryLogic.listWorkspaces(workspaceStorage, await Utils.getAllWindowIds());
}

/**
 * Present a popup asking for the workspace name, then create a new window and add it to the workspaces.
 * @returns {Promise<void>}
 */
async function addWorkspaceButtonClicked() {
   const pageAddWorkspace = new PageAddWorkspace();
   pageAddWorkspace.open();
}

/**
 * Present a popup asking for confirmation, then clear all workspace data.
 */
async function settingsButtonClicked() {
   const pageSettings = new PageSettings();
   pageSettings.open();
}

/**
 * When a window is added or removed, update the workspace list.
 * @param {chrome.windows.window} window 
 */
async function windowRemoved(window) {
   console.debug("Popup: windowRemoved", window);
   WorkspaceEntryLogic.listWorkspaces(await getWorkspaceStorage());
}

/**
 * Get the full workspace storage object from the background script
 * @returns {Promise<WorkspaceStorage>}
 */
export async function getWorkspaceStorage() {
   return StorageHelper.workspacesFromJson(await PopupMessageHelper.sendGetWorkspaces());
}

/**
 * This is the entry point for the popup.
 * When the DOM is loaded, call the documentLoaded function, to keep things clean.
 */
(async function () { document.addEventListener("DOMContentLoaded", documentLoaded); })();
