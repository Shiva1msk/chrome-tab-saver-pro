function unique(urls) {
  return [...new Set(urls)];
}

// Auto-save workspace
function autoSave() {
  chrome.tabs.query({}, (tabs) => {
    const urls = unique(tabs.map(t => t.url));

    chrome.storage.local.get(["workspaces", "lastWorkspace"], (data) => {
      const workspaces = data.workspaces || {};
      const last = data.lastWorkspace || "AutoSession";

      workspaces[last] = urls;
      chrome.storage.local.set({ workspaces });

      console.log("✅ Auto-saved workspace");
    });
  });
}

// Alarm every 5 minutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("autoSaveTabs", {
    periodInMinutes: 5
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoSaveTabs") {
    autoSave();
  }
});

// Restore last workspace on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["workspaces", "lastWorkspace"], (data) => {
    const name = data.lastWorkspace;
    const urls = (data.workspaces || {})[name] || [];

    urls.forEach(url => {
      chrome.tabs.create({ url });
    });

    console.log("🚀 Restored last workspace");
  });
});