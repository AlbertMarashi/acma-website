<footer>
  <div class="grey-footer">
    <div class="inner-content column">
      <h3 class='stats-title center'>ACMA SA Statistics in 2018</h3>
      <div class="seperators center">
        <div>
          <span>{!! get_field('statistic-one-text', 'options') !!}</span>
          <div class="big-number">
            {!! get_field('statistic-one-number', 'options') !!}
          </div>
        </div>
        <div>
          <span>{!! get_field('statistic-two-text', 'options') !!}</span>
          <div class="big-number">
            {!! get_field('statistic-two-number', 'options') !!}
          </div>
        </div>
        <div>
          <span>{!! get_field('statistic-three-text', 'options') !!}</span>
          <div class="big-number">
            {!! get_field('statistic-three-number', 'options') !!}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="hero image padding-small" style="background-image: url({{ get_field('banner-image', 'options') }})">
    <div class="inner-content column">
      <div class="flex">
          @if(have_rows('corporate-sponsor', 'options'))
          <div class="sponsor-box">
            <div class="sponsor-title">Corporate Sponsors</div>
            <div class="sponsor-container">
                @while (have_rows('corporate-sponsor', 'options') && the_row())
                  <a href="{{ the_sub_field('website-link') }}">
                    <img src="{!! the_sub_field('image') !!}">
                  </a>
                @endwhile
            </div>
          </div>
          @endif
      </div>
      <div class="flex mobile">
        @if(have_rows('major-sponsor', 'options'))
        <div class="sponsor-box">
          <div class="sponsor-title">Major Sponsors</div>
          <div class="sponsor-container">
              @while (have_rows('major-sponsor', 'options') && the_row())
                <a href="{{ the_sub_field('website-link') }}">
                  <img src="{!! the_sub_field('image') !!}">
                </a>
              @endwhile
          </div>
        </div>
        @endif
        @if(have_rows('strategic-partner', 'options'))
        <div class="sponsor-box">
          <div class="sponsor-title">Strategic Partners</div>
          <div class="sponsor-container">
              @while (have_rows('strategic-partner', 'options') && the_row())
                <a href="{{ the_sub_field('website-link') }}">
                  <img src="{!! the_sub_field('image') !!}">
                </a>
              @endwhile
          </div>
        </div>
        @endif
      </div>
    </div>
  </div>
  <div class="grey-footer">
    <div class="inner-content column text-center">
        <h2 class="footer-header">Contact Us</h2>
        <div class='flex column center'>
          <div class="flex-left">
            <span class="contact-item">
              <i class="material-icons wrapping">person</i>
              <div class="contact-text">{{ get_field('contact-name', 'options') }}</div>
            </span>
            <span class="contact-item">
                <i class="material-icons wrapping">email</i>
                <a class="contact-text" href="tel:{{ get_field('contact-number', 'options') }}">{{ get_field('contact-number', 'options') }}</a>
            </span>
            <span class="contact-item">
              <i class="material-icons wrapping">phone</i>
              <a class="contact-text" href="mailto:{{ get_field('contact-email', 'options') }}">{{ get_field('contact-email', 'options') }}</a>
            </span>
            
          </div>
          <p style="text-align: left; font-size: 1.2em;">{!! get_field('company-text', 'options') !!}</p>
        </div>
    </div>
  </div>
  <div class="final-footer">
    <div class="inner-content column text-center">
      <a class="brand center" href="{{ home_url('/') }}">
        @php
          $custom_logo_id = get_theme_mod( 'custom_logo' );
          $custom_logo_url = wp_get_attachment_image_url( $custom_logo_id , 'full' );
        @endphp
        <img src="{!! esc_url( $custom_logo_url ) !!}" class="logo"/>
        <span>{{ get_bloginfo('name', 'display') }}</span>
      </a>
      <span>
        @if(get_field('footer-text', 'options'))
          {!! get_field('footer-text', 'options') !!}
        @endif
      </span>
    </div>
  </div>
</footer>
