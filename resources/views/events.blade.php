{{--
  Template Name: Events
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero image" style="background-image: url({{ get_the_post_thumbnail_url() }})">
  <div class="inner-hero page-text padding-medium center column text-center">
    <h1 class="title shadow">{{ get_the_title() }}</h1>
    {{ the_content() }}
  </div>
</div>
<div class="hero">
  <div class="inner-hero padding-small">
    @php
      $the_query = new WP_Query([
        'tag' => 'event',
        'posts_per_page'=> 20,
        'meta_key' => 'date-start',
        'order' => 'ASC',
        'orderby' => 'meta_value',
        'meta_query' => [
          [
            'key' => 'date-start',
            'type' => 'DATETIME',
            'value' => date('Y-m-d H:i:s'),
            'compare' => '>='
          ],
        ]
      ]);
    @endphp

    @if( $the_query->have_posts() )
    <div class="events-container flex">
      @while($the_query->have_posts())
          {{ $the_query->the_post() }}
          <div class="event-box">
            <div class="event-background" style="background-image: url({{ get_the_post_thumbnail_url() }})">
              {{ get_the_title() }}
            </div>
            <div class="buttons-event">
                <a href="{{ get_permalink() }}" class="button flat secondary">ABOUT EVENT</a>
                <a href="{{ get_field('book-link') }}" class="button secondary">BOOK NOW</a>
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