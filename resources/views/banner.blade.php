{{--
  Template Name: Banner Page
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
    </div>
  </div>
</div>

@endsection