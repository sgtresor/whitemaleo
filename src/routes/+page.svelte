<script lang="ts">
  import { executeRequest } from '$lib/requestLogic'; 

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

  // Define headers for JSON
  const headers = { "Content-Type": "application/json" };

  async function handleSend() {
    loading = true;
    error = "";
    response = "";

    try {
      const res = await executeRequest(method, url, headers, body, script);
      try {
        response = JSON.stringify(JSON.parse(res), null, 2);
      } catch {
        response = res;
      }
    } catch (e) {
      error = String(e);
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col h-screen p-4 gap-4 text-sm">
  
  <header class="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md shadow-2xl">
    
    <div class="flex items-center gap-3 mr-4 pl-2">
      <div class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]"></div>
      <span class="font-bold text-zinc-100 tracking-[0.2em] text-xs">WHITEMALEO</span>
    </div>
    
    <select 
      bind:value={method} 
      style="color-scheme: dark;"
      class="bg-zinc-900/50 text-rose-400 px-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-rose-500/50 font-bold cursor-pointer transition-all hover:bg-zinc-800/50 text-xs"
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
    </select>

    <input 
      bind:value={url} 
      type="text" 
      placeholder="https://api.example.com" 
      class="flex-1 bg-zinc-950/50 text-zinc-100 px-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder-zinc-700 font-mono"
    />

    <button 
      on:click={handleSend} 
      disabled={loading}
      class="bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border border-white/10 tracking-wide"
    >
      {loading ? "SENDING..." : "SEND"}
    </button>
  </header>

  <div class="flex flex-1 gap-4 overflow-hidden">
    
    <div class="w-1/2 flex flex-col rounded-xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
      <div class="flex border-b border-white/5 bg-black/20">
        <button 
          class="px-6 py-3 text-xs font-bold tracking-wide transition-colors {activeTab === 'body' ? 'text-rose-400 border-b-2 border-rose-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}"
          on:click={() => activeTab = 'body'}>
          JSON BODY
        </button>
        <button 
          class="px-6 py-3 text-xs font-bold tracking-wide transition-colors {activeTab === 'script' ? 'text-rose-400 border-b-2 border-rose-500 bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}"
          on:click={() => activeTab = 'script'}>
          PRE-REQUEST SCRIPT
        </button>
      </div>

      <div class="flex-1 relative bg-transparent">
        {#if activeTab === 'body'}
          <textarea 
            bind:value={body}
            class="w-full h-full bg-transparent p-6 text-zinc-300 focus:outline-none resize-none font-mono leading-relaxed text-xs"
            placeholder="{'{ "key": "value" }'}"
            spellcheck="false"
          ></textarea>
        {:else}
          <textarea 
            bind:value={script}
            class="w-full h-full bg-transparent p-6 text-yellow-100/90 focus:outline-none resize-none font-mono leading-relaxed text-xs"
            placeholder="// Write JS here. Use pm.environment.set('key', 'val')"
            spellcheck="false"
          ></textarea>
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
      
      <div class="flex-1 overflow-auto p-6 bg-transparent custom-scrollbar">
        {#if loading}
          <div class="flex flex-col items-center justify-center h-full text-zinc-600 gap-4">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-rose-500"></div>
            <span class="text-xs tracking-widest animate-pulse font-bold">CONTACTING SATELLITE...</span>
          </div>

        {:else if error}
          <div class="text-rose-300 p-4 bg-rose-950/30 rounded border border-rose-500/20 font-mono text-xs">
            <strong class="block mb-2 text-rose-500">REQUEST FAILED</strong>
            {error}
          </div>

        {:else if response}
          <pre class="text-emerald-300 whitespace-pre-wrap font-mono text-xs leading-loose">{response}</pre>

        {:else}
          <div class="flex flex-col items-center justify-center h-full text-zinc-700 gap-2 opacity-50">
            <div class="text-4xl">📡</div>
            <div class="text-xs italic">Ready to transmit</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>