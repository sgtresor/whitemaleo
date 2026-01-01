<svelte:window on:keydown={handleKeydown} />
<script lang="ts">
  import { executeRequest } from '$lib/requestLogic'; 
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { onMount } from 'svelte';
  
  import CodeMirror from "svelte-codemirror-editor";
  import { json } from "@codemirror/lang-json";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { EditorView, keymap } from "@codemirror/view";
  import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
  import { Prec } from "@codemirror/state";

  // State
  let method = "GET";
  let url = "https://jsonplaceholder.typicode.com/users/{{id}}";
  let body = '{\n  "foo": "bar"\n}';
  let script = `// Example Script:
pm.environment.set("id", "1");`;
  
  let response = "";
  let loading = false;
  let error = "";
  let activeTab = "body"; 
  let appWindow: any;
  let activeRequestId = 0;

  onMount(() => {
    appWindow = getCurrentWindow();
  });

  const headers = { "Content-Type": "application/json" };

  async function handleSend() {
    if (loading) {
      loading = false;
      activeRequestId++;
      return;
    }

    loading = true;
    error = "";
    response = "";
    activeRequestId++;
    const myRequestId = activeRequestId;

    try {
      const res = await executeRequest(method, url, headers, body, script);
      if (activeRequestId !== myRequestId) return;
      
      try {
        response = JSON.stringify(JSON.parse(res as string), null, 2);
      } catch (error) {
        response = res as string;
      }
    } catch (e: any) {
      if (activeRequestId !== myRequestId) return;
      error = String(e);
    } finally {
      if (activeRequestId === myRequestId) {
        loading = false;
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      // SAFETY CHECK:
      // If the focus is inside CodeMirror, our "Prec.highest" extension 
      // is ALREADY handling this. We must ignore it here to prevent 
      // double-firing or conflicts.
      const target = e.target as HTMLElement;
      if (target.classList.contains('cm-content')) {
        return; 
      }

      // If focus is NOT in editor (e.g. URL bar), run the request manually
      e.preventDefault();
      handleSend();
    }
  }

  const sendShortcut = Prec.highest(
    keymap.of([
      {
        key: "Mod-Enter", // Works as Ctrl-Enter on Linux/Windows, Cmd-Enter on Mac
        run: () => {
          handleSend();
          return true; // "True" tells CodeMirror: STOP here, do not insert new line
        }
      }
    ])
  );

  // 2. CUSTOM THEME TO MAKE EDITOR TRANSPARENT (So it blends with your Glass UI)
  const transparentTheme = EditorView.theme({
    "&": {
      backgroundColor: "transparent !important",
      height: "100%"
    },
    ".cm-gutters": {
      backgroundColor: "transparent !important",
      color: "#52525b", // Zinc-600 for line numbers
      border: "none"
    }
  });
</script>

<div class="flex flex-col h-screen p-4 gap-4 text-sm font-sans">
  
  <header class="relative p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
    <div data-tauri-drag-region class="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"></div>
    <div class="relative z-10 flex items-center gap-3 pointer-events-none">
      <div class="flex items-center gap-3 mr-4 pl-2">
        <div class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]"></div>
        <span class="font-bold text-zinc-100 tracking-[0.2em] text-xs">WHITEMALEO</span>
      </div>
      
      <select bind:value={method} style="color-scheme: dark;" class="pointer-events-auto bg-zinc-900/50 text-rose-400 px-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-rose-500/50 font-bold cursor-pointer transition-all hover:bg-zinc-800/50 text-xs">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>

      <input bind:value={url} type="text" placeholder="https://api.example.com" class="pointer-events-auto flex-1 bg-zinc-950/50 text-zinc-100 px-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder-zinc-700 font-mono" />

      <button 
        on:click={handleSend}
        class="pointer-events-auto bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-rose-900/20 active:scale-95 border border-white/10 tracking-wide"
      >
        {loading ? "CANCEL" : "SEND"}
      </button>

      <div class="pointer-events-auto flex items-center gap-2 ml-2 pl-4 border-l border-white/5">
        <button aria-label="Minimize" on:click={() => appWindow?.minimize()} class="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
        </button>
        <button aria-label="Maximize" on:click={() => appWindow?.toggleMaximize()} class="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
        </button>
        <button aria-label="Close" on:click={() => appWindow?.close()} class="p-2 hover:bg-rose-500/20 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="flex flex-1 gap-4 overflow-hidden">
    <div class="w-1/2 flex flex-col rounded-xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
      <div class="flex border-b border-white/5 bg-black/20">
        <button class="px-6 py-3 text-xs font-bold tracking-wide transition-colors {activeTab === 'body' ? 'text-rose-400 border-b-2 border-rose-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}" on:click={() => activeTab = 'body'}>JSON BODY</button>
        <button class="px-6 py-3 text-xs font-bold tracking-wide transition-colors {activeTab === 'script' ? 'text-rose-400 border-b-2 border-rose-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}" on:click={() => activeTab = 'script'}>PRE-REQUEST SCRIPT</button>
      </div>
      
      <div class="flex-1 relative overflow-auto text-xs">
        {#if activeTab === 'body'}
          <CodeMirror 
            bind:value={body} 
            lang={json()} 
            theme={oneDark} 
            extensions={[
              transparentTheme,
              history(),
              sendShortcut,
              keymap.of([...defaultKeymap, ...historyKeymap])
            ]}
            styles={{ "&": { height: "100%" } }}
          />
        {:else}
          <CodeMirror 
            bind:value={script} 
            lang={javascript()} 
            theme={oneDark} 
            extensions={[
              transparentTheme,
              history(),
              sendShortcut,
              keymap.of([...defaultKeymap, ...historyKeymap])
            ]}
            styles={{ "&": { height: "100%" } }}
          />
        {/if}
      </div>
    </div>

    <div class="w-1/2 flex flex-col rounded-xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
      <div class="px-5 py-3 border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-widest font-bold flex justify-between items-center bg-black/20">
        <span>Response</span>
        {#if response && !error && !loading}
          <span class="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">200 OK</span>
        {/if}
      </div>
      
      <div class="flex-1 overflow-auto bg-transparent relative custom-scrollbar">
        {#if loading}
          <div class="flex flex-col items-center justify-center h-full text-zinc-600 gap-4">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-rose-500"></div>
            <span class="text-xs tracking-widest animate-pulse font-bold">CONTACTING SATELLITE...</span>
          </div>
        {:else if error}
          <div class="text-rose-300 p-4 bg-rose-950/30 rounded border border-rose-500/20 font-mono text-xs"><strong class="block mb-2 text-rose-500">REQUEST FAILED</strong>{error}</div>
        
        {:else if response}
          <div class="h-full text-xs">
            <CodeMirror 
              value={response} 
              lang={json()} 
              theme={oneDark} 
              readonly={true}
              extensions={[
                transparentTheme,
                keymap.of([...defaultKeymap])
              ]}
              styles={{ "&": { height: "100%" } }}
            />
          </div>

        {:else}
          <div class="flex flex-col items-center justify-center h-full text-zinc-700 gap-2 opacity-50"><div class="text-4xl">📡</div><div class="text-xs italic">Ready to transmit</div></div>
        {/if}
      </div>
    </div>
  </div>
</div>