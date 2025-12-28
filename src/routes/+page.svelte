<script lang="ts">
  // In SvelteKit, $lib is an alias for src/lib
  import { executeRequest } from '$lib/requestLogic'; 

  // State
  let method = "GET";
  let url = "https://jsonplaceholder.typicode.com/users/{{id}}";
  let body = '{\n  "foo": "bar"\n}';
  let script = `// Example Script:
// Set the ID variable to 1
pm.environment.set("id", "1");
`;
  
  let response = "";
  let loading = false;
  let error = "";
  let activeTab = "body"; 

  async function handleSend() {
    loading = true;
    error = "";
    response = "";

    try {
      // Define headers
      const headers = { 
        "Content-Type": "application/json" 
      };

      // Pass them to the function
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

<div class="flex flex-col h-screen bg-gray-900 text-gray-100 font-mono text-sm">
  <header class="flex items-center gap-2 p-4 border-b border-gray-700 bg-gray-800">
    <div class="font-bold text-emerald-400 mr-4 tracking-widest">WHITEMALEO</div>
    
    <select 
      bind:value={method} 
      style="color-scheme: dark;"
      class="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-emerald-500 font-bold cursor-pointer"
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
      class="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-emerald-500"
    />

    <button 
      on:click={handleSend} 
      disabled={loading}
      class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "SENDING..." : "SEND"}
    </button>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <div class="w-1/2 flex flex-col border-r border-gray-700">
      <div class="flex border-b border-gray-700 bg-gray-800">
        <button 
          class="px-4 py-2 hover:bg-gray-700 {activeTab === 'body' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400'}"
          on:click={() => activeTab = 'body'}>
          JSON Body
        </button>
        <button 
          class="px-4 py-2 hover:bg-gray-700 {activeTab === 'script' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400'}"
          on:click={() => activeTab = 'script'}>
          Pre-request Script
        </button>
      </div>

      <div class="flex-1 relative bg-gray-900">
        {#if activeTab === 'body'}
          <textarea 
            bind:value={body}
            class="w-full h-full bg-gray-900 p-4 text-gray-300 focus:outline-none resize-none font-mono"
            placeholder="{'{ "key": "value" }'}"
          ></textarea>
        {:else}
          <textarea 
            bind:value={script}
            class="w-full h-full bg-gray-900 p-4 text-yellow-100 focus:outline-none resize-none font-mono"
            placeholder="// Write JS here. Use pm.environment.set('key', 'val')"
          ></textarea>
        {/if}
      </div>
    </div>

    <div class="w-1/2 flex flex-col bg-gray-800">
      <div class="px-4 py-2 border-b border-gray-700 text-gray-400 text-xs uppercase tracking-wider">
        Response
      </div>
      <div class="flex-1 overflow-auto p-4">
        {#if loading}
          <div class="flex flex-col items-center justify-center h-full text-gray-500">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
            <span class="text-xs animate-pulse">Sending Request...</span>
          </div>
        {:else if error}
          <div class="text-red-400 p-4 bg-red-900/20 rounded border border-red-900/50 font-mono text-xs">
            <strong>Error:</strong> {error}
          </div>
        {:else if response}
          <pre class="text-emerald-300 whitespace-pre-wrap font-mono text-xs">{response}</pre>

        {:else}
          <div class="text-gray-600 text-center mt-10 italic">
            Hit <span class="text-emerald-500 font-bold">SEND</span> to see response...
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>