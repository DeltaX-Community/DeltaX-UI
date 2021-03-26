<svelte:options tag={"dx-header-bar"} />

<script>
    import { Get } from "../api/request";
    import Common from "../Settings/Common";

    $: IsDarkMode = Common.IsDarkMode;
    $: dark = $IsDarkMode ? "dark" : "";

    var menu = {
        title: "Planta1",
        url: "/#home.html",
        logo: "<i class='fas fa-sun text-xl lg:text-4xl'></i>",
        items: [
            {
                title: "Planta 1",
                url: "/planta1/#home.html",
                color: "green-600",
                icon: "fas fa-home",
            },
        ],
        tabs: [
            {
                title: "Operaciones",
                url: "#operaciones.html",
                color: "red-600",
                icon: "fas fa-home",
            },
        ],
    };

    let defaultUrl = "";
    let currTab = location.hash;
    let currItem = menu.tabs?.find((i) => i.url == currTab);
    let menuHidden = true;
    let userMenu = false;

    function onPopstate() {
        currTab = location.hash;
        currItem = menu.tabs?.find((i) => i.url == currTab);
    }

    window.addEventListener("popstate", function () {
        onPopstate();
    });

    function getMenu() {
        Get(`menu.json`).then((json) => {
            console.log("menu:", json);
            menu = json;
            onPopstate();
            defaultUrl = menu.tabs ? menu.tabs[0].url : "#";
            if (!location.hash && defaultUrl.length > 1) {
                location.href = defaultUrl;
            }
        });
    }

    getMenu();

    $: getClass = function (item) {
        if (currTab == item.url) {
            return `text-black font-bold dark:text-white border-${item.color} hover:border-${item.color}`;
        } else {
            return `hover:border-${item.color} text-gray-500 dark:text-gray-300`;
        }
    };
</script>

<div class="sticky w-full z-10 top-0 {dark}">
    <nav
        id="header"
        class="bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 w-full shadow-md mb-0"
    >
        <div class="w-full mx-auto flex flex-wrap items-center mt-0 pt-3 pb-3">
            <div class="pl-2 md:pl-2">
                <div
                    class=" text-base lg:text-xl no-underline font-bold flex flex-row items-center gap-2"
                >
                    <div
                        contenteditable="false"
                        bind:innerHTML={menu.logo}
                        class="text-{currItem?.color}"
                    />
                    <a
                        href={menu.url}
                        class="block pr-1 align-middle text-base no-underline hover:text-blue-400 border-b-2 border-transparent"
                    >
                        {menu.title}
                    </a>
                    {#if menu.items}
                        {#each menu.items as item}
                            <span class="font-medium text-base m-0 p-0">/</span>
                            <a
                                href={item.url}
                                class="block align-middle text-base no-underline hover:text-blue-400 border-b-2 border-transparent"
                            >
                                {item.title}
                            </a>
                        {/each}
                    {/if}
                </div>
            </div>
            <div class="pr-0 flex-grow">
                <slot />
            </div>
            <div class="pr-0">
                <div class="flex relative float-right">
                    <!-- User Menu -->
                    <div class="relative text-sm">
                        <button
                            on:click={() => (userMenu = !userMenu)}
                            class="flex items-center focus:outline-none mr-3"
                        >
                            <img
                                class="w-8 h-8 rounded-full mr-4"
                                src="/assets/img/avatar.jpg"
                                alt="Avatar of User"
                            />
                            <span class="hidden md:inline-block">
                                Hi, User
                            </span>
                            <svg
                                class="pl-2 h-2"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 129 129"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                enable-background="new 0 0 129 129"
                            >
                                <g>
                                    <path
                                        d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"
                                    />
                                </g>
                            </svg>
                        </button>

                        <div
                            class="rounded shadow-md bg-gray-800 text-white opacity-90 absolute mt-8 top-2 right-2 min-w-full overflow-auto z-30 {userMenu ===
                            false
                                ? 'hidden'
                                : ''}"
                            on:click={() => {
                                userMenu = false;
                            }}
                        >
                            <ul class="list-reset">
                                <li>
                                    <a
                                        href="#profile"
                                        class="px-4 py-2 block  hover:bg-gray-700 no-underline hover:no-underline"
                                    >
                                        My account
                                    </a>
                                </li>
                                <li>
                                    <span
                                        on:click={() =>
                                            Common.setDarkMode(!$IsDarkMode)}
                                        class="px-4 py-2 block  hover:bg-gray-700 no-underline hover:no-underline cursor-pointer"
                                    >
                                        {$IsDarkMode ? "Light" : "Dark"}
                                    </span>
                                </li>
                                <li>
                                    <a
                                        href="#noty"
                                        class="px-4 py-2 block  hover:bg-gray-700 no-underline hover:no-underline"
                                    >
                                        Notifications
                                    </a>
                                </li>
                                <li>
                                    <hr class="border-t mx-2 border-gray-700" />
                                </li>
                                <li>
                                    <a
                                        href="#logout"
                                        class="px-4 py-2 block  hover:bg-gray-700 no-underline hover:no-underline"
                                    >
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Menu Icon  -->
                    {#if menu.tabs && menu.tabs.length > 1}
                        <div class="block lg:hidden pr-4">
                            <button
                                on:click={() => (menuHidden = !menuHidden)}
                                class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 dark:text-white dark:border-white appearance-none focus:outline-none"
                            >
                                <svg
                                    class="fill-current h-3 w-3"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <title>Menu</title>
                                    <path
                                        d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    {/if}
                    <div class="block pr-4 font-extrabold font-mono text-xl">
                        15:24:24
                    </div>
                </div>
            </div>
        </div>
        {#if menu.tabs && menu.tabs.length > 1}
            <div>
                <div
                    class="w-full flex-grow lg:flex lg:items-center lg:mx-auto lg:w-auto mt-2 lg:mt-0 bg-white dark:bg-gray-600 z-20 
            {menuHidden
                        ? 'hidden'
                        : ''}"
                    on:click={() => {
                        menuHidden = true;
                    }}
                >
                    <ul class="list-reset lg:flex flex-1 items-center px-4">
                        {#each menu.tabs as item}
                            <li class="mr-3 my-0 text-sm">
                                <a
                                    href={item.url}
                                    class="block px-1 p-2 align-middle hover:text-black dark:hover:text-gray-100  no-underline border-b-2 border-transparent {getClass(
                                        item
                                    )}"
                                >
                                    <i class={item.icon} />
                                    <span class="pb-1 md:pb-0 text-sm">
                                        {item.title}
                                    </span>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
    </nav>
</div>

<style>
    @import "/global.css";
</style>
