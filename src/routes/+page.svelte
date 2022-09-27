<script>
    import {t, locale, locales} from 'svelte-intl-precompile';
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
</div>
<h1>translated foo:{$t('foo')}</h1>
<style>
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