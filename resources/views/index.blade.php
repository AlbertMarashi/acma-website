@extends('layouts.app')

@section('content')
<div class="hero image padding-medium" style="background-image: url({{ get_field('featured-image', 'options') }})">
  <div class="inner-hero">
    <h1 class="title shadow">{!! get_field('featured-title', 'options') !!}</h1>
    <div class="featured-text shadow">
      {{ get_field('featured-text', 'options') }}
    </div>
    <a class="button featured" href="{{ get_field('featured-button-link', 'options') }}">{{ get_field('featured-button-text', 'options') }}</a>
  </div>
</div>
@php

  $the_query = new WP_Query([
    'tag' => 'event',
    'posts_per_page'=> 3,
    'meta_key' => 'date-start',
    'order' => 'ASC',
    'orderby' => 'meta_value',
    'meta_query' => [
      [
        'key' => 'date-start',
        'type' => 'DATETIME',
        'value' => date('Y-m-d H:i:s', time() - 3600 * 2),
        'compare' => '>='
      ],
    ]
  ]);
@endphp
@if( $the_query->have_posts() )
<div class="hero padding-small">
  <div class="inner-hero flex column center">
    <h2 class="front-page-h2">Book Your Event</h2>

    <div class="events-container flex">
      @while($the_query->have_posts())
          {{ $the_query->the_post() }}
          <div class="event-box">
            <a href="{{ get_permalink() }}" class="event-background" style="background-image: url({{ get_the_post_thumbnail_url() }})">
              {!! get_the_title() !!}
            </a>
            <div class="buttons-event">
                <a href="{{ get_permalink() }}" class="button flat secondary">ABOUT EVENT</a>
                <a href="{{ get_field('book-link') ? get_field('book-link') : get_permalink() }}" class="button secondary">BOOK NOW</a>
            </div>
          </div>
      @endwhile
    </div>
    @php
      wp_reset_postdata();
    @endphp
  </div>
</div>
@endif
<div class="hero image padding-small" style="background-image: url({{ get_field('banner-image', 'options') }})">
  <div class="inner-hero">
    <h2 class="title shadow">{!! get_field('banner-title', 'options') !!}</h2>
    <div class="featured-text shadow">
      {!! get_field('banner-text', 'options') !!}
    </div>
    <a class="button featured" href="{{ get_field('banner-button-link', 'options') }}">{{ get_field('banner-button-text', 'options') }}</a>
  </div>
</div>
<div class="hero padding-small">
  <div class="inner-hero flex column center">
    <h2 class="front-page-h2">Latest News</h2>
    @php
      $the_query = new WP_Query(['tag' => 'news', 'posts_per_page'=> 3 ]);
    @endphp

    @if( $the_query->have_posts() )
    <div class="events-container flex">
      @while($the_query->have_posts())
          {{ $the_query->the_post() }}
          <div class="event-box">
            <div class="event-background" style="background-image: url({{ get_the_post_thumbnail_url() }})">
              {!! get_the_title() !!}
            </div>
            <div class="excerpt">
              {!! wp_trim_words(wp_strip_all_tags(get_the_content()), 25) !!}
            </div>
            <div class="buttons-event">
                <a href="{{ get_permalink() }}" class="button flat secondary">READ MORE</a>
            </div>
          </div>
      @endwhile
    </div>
    @endif
    @php
      wp_reset_postdata();
    @endphp
  </div>
</div>
@endsection
