{{--
  Template Name: About
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero">
  <div class="inner-hero image padding-large center column" style="background-image: url({{ get_the_post_thumbnail_url() }})">
    <h1 class="title shadow">{{ get_the_title() }}</h1>
  </div>
  <div class="inner-hero page">
    {{ the_content() }}
</div>
  
@endsection
