<script>
    import {t, locale, locales} from 'svelte-intl-precompile';
    import {cool} from '$lib/cool.js'
    let name = "Name";
</script>
<div class="locale-switcher">
    {#each $locales as loc}
        <button
                type="button"
                class="locale-btn"
                class:active={loc === $locale}
                on:click={() => ($locale = loc)}
                aria-label="{loc}"
        >
            {loc}
        </button>
    {/each}
    <label for="name" class="name">name: <input id="name" bind:value={name}></label>
</div>

<h1>{$t('foo',{values:{name}})}</h1>

<button on:click={()=>{cool()}}>cool alert</button>
<style>
    .name {
        padding: 0.5rem;
    }
    .locale-switcher {
        display: flex;
        gap: 1rem
    }
    .locale-btn {
        width: 4rem;
        padding: 0.25rem;
    }
    .locale-btn.active {
        font-weight: bold;
    }
</style>