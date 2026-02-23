const workspaceInput = document.getElementById("workspaceName");
const workspaceList = document.getElementById("workspaceList");

// Load workspace list
function loadWorkspaces() {
  chrome.storage.local.get("workspaces", (data) => {
    const workspaces = data.workspaces || {};
    workspaceList.innerHTML = "";

    Object.keys(workspaces).forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      workspaceList.appendChild(option);
    });
  });
}

// Remove duplicate URLs
function removeDuplicates(urls) {
  return [...new Set(urls)];
}

// SAVE WORKSPACE
document.getElementById("saveTabs").addEventListener("click", () => {
  const name = workspaceInput.value.trim();

  if (!name) {
    alert("Enter workspace name");
    return;
  }

  chrome.tabs.query({}, (tabs) => {
    let urls = tabs.map(tab => tab.url);
    urls = removeDuplicates(urls);

    chrome.storage.local.get("workspaces", (data) => {
      const workspaces = data.workspaces || {};
      workspaces[name] = urls;

      chrome.storage.local.set({
        workspaces: workspaces,
        lastWorkspace: name
      }, () => {
        alert("✅ Workspace saved");
        loadWorkspaces();
      });
    });
  });
});

// RESTORE WORKSPACE
document.getElementById("restoreTabs").addEventListener("click", () => {
  const selected = workspaceList.value;

  chrome.storage.local.get("workspaces", (data) => {
    const urls = (data.workspaces || {})[selected] || [];

    urls.forEach(url => {
      chrome.tabs.create({ url });
    });
  });
});

// Initial load
loadWorkspaces();