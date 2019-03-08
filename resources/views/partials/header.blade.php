<header>
    <div id="clickexit" class="clickexit" onClick="toggle_visibility('menu')"></div>
    <script>
        function toggleMenu(id){
            //get element
            //toggle class
        }

        //check 
    </script>
    <div class="search-panel">
        {!! get_search_form(false) !!}
    </div>
    <div class="header-container">
        <div class="main-header">
            <div class="inner-menu row">
                <a class="brand" href="{{ home_url('/') }}">
                @php
					$custom_logo_id = get_theme_mod( 'custom_logo' );
					$custom_logo_url = wp_get_attachment_image_url( $custom_logo_id , 'full' );
                @endphp
                    <img src="{!! esc_url( $custom_logo_url ) !!}" class="logo"/>
                    {{ get_bloginfo('name', 'display') }}
                </a>
                <div class="flex end" style="align-self: stretch;">
                    <div class="flex-align">
                        <a href="/join-us" class="button secondary">Join Us</a>
                        <a href="#" class="button secondary search">
                            <svg style="width:28.5px;height:28.5px" viewBox="0 0 24 24">
                                <path fill="#fff" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <nav class="primary-nav">
            <div class="inner-menu">
                <span class="chinese-text">澳大利亚华人医学会</span>
                <div class="flex end">
                    @if (has_nav_menu('primary-nav'))
                        {!! wp_nav_menu(['theme_location' => 'primary-nav', 'menu_class' => 'nav']) !!}
                    @endif
                    <div class="menu-icon">
                        <a href="#"><i class="material-icons">menu</i></a>
                    </div>
                </div>
            </div>
        </nav>
        <nav class="secondary-nav">
            <div class="inner-menu">
                <a href="#" class="secondary-nav-drop">
                    <i class="material-icons">
                        keyboard_arrow_down
                    </i>
                </a>
            </div>
            <div class="inner-menu">
                @if (has_nav_menu('secondary-nav'))
                    {!! wp_nav_menu(['theme_location' => 'secondary-nav', 'menu_class' => 'nav']) !!}
                @endif
            </div>
        </nav>
    </div>
</header>