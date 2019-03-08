{{--
  Template Name: Event
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero">
  <div class="inner-hero image padding-medium center column" style="background-image: url({{ get_the_post_thumbnail_url() }})">
    <h1 class="title shadow">{{ get_the_title() }}</h1>
    <a class="button featured" href="{{ get_field('book-link') }}">BOOK NOW</a>
  </div>
  <div class="inner-hero page">
    @if(get_field('date-start') || get_field('date-finish') || get_field('where'))
      <div>
        @if(get_field('date-start'))
          <p><strong>When: </strong>{{ get_field('date-start') }}</p>
        @endif
        @if(get_field('date-finish'))
          <p><strong>Until: </strong>{{ get_field('date-finish') }}</p>
        @endif
        @if(get_field('where'))
          <p><strong>Where: </strong>{{ get_field('where') }}</p>
        @endif
        <br>
      </div>
    @endif
    {{ the_content() }}
</div>
  
@endsection
