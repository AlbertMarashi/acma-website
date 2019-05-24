{{--
  Template Name: Sponsors Page
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero image" style="background-image: url({{ get_the_post_thumbnail_url() }})">
  <div class="inner-hero page-text padding-small center column text-center" >
    <h1 class="title shadow">{!! get_the_title() !!}</h1>
  </div>
</div>
<div class="hero">
  <div class="inner-hero page">
    <div class="inner-page">
      {{ the_content() }}
      <h2>Corporate Sponsors</h2>
      @while (have_rows('corporate-sponsor', 'options') && the_row())
        <a class="sponsor-link" href="{{ the_sub_field('website-link') }}">
          <img class="sponsor-image" src="{!! the_sub_field('image') !!}">
        </a>
      @endwhile
      <hr>
      <h2>Major Sponsors</h2>
      @while (have_rows('major-sponsor', 'options') && the_row())
        <a class="sponsor-link" href="{{ the_sub_field('website-link') }}">
          <img class="sponsor-image" src="{!! the_sub_field('image') !!}">
        </a>
      @endwhile
      <hr>
      <h2>Strategic Partners</h2>
      @while (have_rows('strategic-partner', 'options') && the_row())
        <a class="sponsor-link" href="{{ the_sub_field('website-link') }}">
          <img class="sponsor-image" src="{!! the_sub_field('image') !!}">
        </a>
      @endwhile
    </div>
  </div>
</div>

@endsection