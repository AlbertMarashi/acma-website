{{--
  Template Name: News
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero image" style="background-image: url({{ get_the_post_thumbnail_url() }})">
  <div class="inner-hero page-text padding-medium center column text-center" >
    <h1 class="title shadow">{!! get_the_title() !!}</h1>
    {{ the_content() }}
  </div>
</div>
<div class="hero">
  <div class="inner-hero padding-small">
    @php
    $the_query = new WP_Query(['tag' => 'news', 'posts_per_page'=> 20 ]);
  @endphp

  @if( $the_query->have_posts() )
  <div class="events-container flex">
    @while($the_query->have_posts())
        {{ $the_query->the_post() }}
        <div class="event-box">
          <a href="{{ get_permalink() }}"  class="event-background" style="background-image: url({{ get_the_post_thumbnail_url() }})">
            {!! get_the_title() !!}
          </a>
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

<div class="hero">
  
</div>

@endsection