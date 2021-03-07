<svelte:options tag={null} />

<script>
    export let elementid;

    var template;
    var script;

    var menu = {
        title: "Planta Demo",
        subTitle: "La gran planta demo",
        logo: '<i class="fas fa-sun text-xl lg:text-4xl"></i>',

        items: [
            {
                title: "Inicio",
                url: "#home",
                color: "pink-600",
                icon: "fas fa-home",
                partialPage: "home-page.html",
            },
            {
                title: "Tareas",
                url: "#task",
                color: "red-500",
                icon: "fas fa-tasks",
                partialPage: "tasks-page.html",
            },
            {
                title: "TareasOk",
                url: "#task-ok",
                color: "blue-500",
                icon: "fas fa-tasks",
                partialPage: "demo-panel-tab.html",
            },
            {
                title: "Index",
                url: "/index.html",
                color: "red-600",
                icon: "fas fa-tasks",
                partialPage: "tasks2-page.html",
            },
        ],
    };

    const defaultUrl = menu.items[0].url;
    var currTab = location.hash.split("?")[0] || defaultUrl;
    var currItem = menu.items.find((i) => i.url == currTab);
    var menuHidden = false;
    var userMenu = false;
    console.log(location.hash, currTab, defaultUrl, currItem);

    var loadComponent = function (url) {
        return fetch(url)
            .then((result) => {
                return result.text();
            })
            .then((txt) => {
                const parser = new DOMParser();
                const fragment = parser.parseFromString(txt, "text/html");
                const s = fragment.getElementsByTagName("SCRIPT")[0];
                return { template: txt, script: s };
            });
    };

    var loadUrl = async function (url) {
        url = `/partial/${url}`;
        const a = await loadComponent(url);

        // let script = document.createElement("script");
        // script.setAttribute("src", "/build/alpine.js");
        // document.head.appendChild(script);

        template = a.template;
        console.log(elementid, a.script);
        if (a.script) {
            script = document.createElement("script");
            script.innerHTML = a.script.innerHTML;
            document.body.appendChild(script);
        }

        if (elementid) {
            var el = document.getElementById(elementid);
            console.log(elementid, el);
            if (el) {
                el.innerHTML = a.template;
            }
        }
    };

    $: getClass = function (item) {
        if (currTab == item.url) {
            return `text-${item.color} border-${item.color} hover:border-${item.color}`;
        } else {
            return `hover:border-${item.color}`;
        }
    };

    function toggleUserMenu() {
        console.log("userMenu", userMenu);
        userMenu = !userMenu;
    }

    var setUrl = function (url) {
        console.log("setUrl", setUrl);
        currItem = menu.items.find((i) => i.url == url);
        currTab = url;
        loadUrl(currItem.partialPage);
    };

    window.onpopstate = function (event) {
        const newTab = location.hash.split("?")[0] || currTab;
        if (newTab != currTab && menu.items.find((i) => i.url == newTab)) {
            location.reload();
        }
    };
</script>

<nav id="header" class="bg-white sticky w-full z-10 top-0 shadow-md mb-4">
    <div
        class="w-full mx-auto flex flex-wrap items-center mt-0 pt-3 pb-3 md:pb-3 lg:pb-0"
    >
        <div class="w-1/2 pl-2 md:pl-2">
            <div
                class="text-gray-900 text-base lg:text-2xl no-underline font-bold flex flex-row items-center gap-2"
            >
                <div
                    contenteditable="false"
                    bind:innerHTML={menu.logo}
                    class="text-{currItem.color}"
                />
                <a on:click={() => setUrl(defaultUrl)} href={defaultUrl}
                    >{menu.title}</a
                >
                {#if currItem.url != defaultUrl}
                    <p class="font-medium text-base">/</p>
                    <p class="font-medium text-base">{currItem.title}</p>
                {/if}
            </div>
        </div>
        <div class="w-1/2 pr-0">
            <div class="flex relative float-right">
                <!-- User Menu -->
                <div class="relative text-sm">
                    <button
                        on:click={toggleUserMenu}
                        class="flex items-center focus:outline-none mr-3"
                    >
                        <img
                            class="w-8 h-8 rounded-full mr-4"
                            src="http://i.pravatar.cc/300"
                            alt="Avatar of User"
                        />
                        <span class="hidden md:inline-block"> Hi, User </span>
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
                        class="rounded shadow-md bg-gray-100 absolute mt-8 top-2 right-2 min-w-full overflow-auto z-30 {userMenu ===
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
                                    class="px-4 py-2 block text-gray-900 hover:bg-gray-400 no-underline hover:no-underline"
                                >
                                    My account
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#noty"
                                    class="px-4 py-2 block text-gray-900 hover:bg-gray-400 no-underline hover:no-underline"
                                >
                                    Notifications
                                </a>
                            </li>
                            <li>
                                <hr class="border-t mx-2 border-gray-400" />
                            </li>
                            <li>
                                <a
                                    href="#logout"
                                    class="px-4 py-2 block text-gray-900 hover:bg-gray-400 no-underline hover:no-underline"
                                >
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Menu Icon  -->
                <div class="block lg:hidden pr-4">
                    <button
                        on:click={() => (menuHidden = !menuHidden)}
                        class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-900 hover:border-teal-500 appearance-none focus:outline-none"
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
            </div>
        </div>

        <div
            class="w-full flex-grow lg:flex lg:items-center lg:container lg:mx-auto lg:w-auto mt-2 lg:mt-0 bg-white z-20 {menuHidden ===
            false
                ? 'hidden'
                : ''}"
            on:click={() => {
                menuHidden = false;
            }}
        >
            <ul class="list-reset lg:flex flex-1 items-center px-4">
                {#each menu.items as item}
                    <li class="mr-3 my-0 text-sm">
                        <a
                            href={item.url}
                            class="block px-1 p-2 align-middle text-gray-500 no-underline hover:text-gray-900 border-b-2 border-transparent {getClass(
                                item
                            )}"
                            on:click={setUrl(item.url)}
                        >
                            <i class="{item.icon} fa-fw mr-3" />
                            <span class="pb-1 md:pb-0 text-sm">
                                {item.title}
                            </span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>

{currTab}
{#each menu.items as item}
    <div class="lg:container lg:mx-auto">
        {#if currTab == item.url}
            {JSON.stringify(item)}
            <!-- --- {@html template?.innerHTML} --- -->
            <!-- <d-load-partial url={item.partialPage} /> -->
        {/if}
    </div>
{/each}

<style>
    @import "/build/tailwind.min.css";
</style>
