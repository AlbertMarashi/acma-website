@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero">
  <div class="inner-hero image padding-small center column" style="background-image: url({{ get_the_post_thumbnail_url() }})">
    <h1 class="title shadow">Page not found</h1>
  </div>
  <div class="inner-hero page">
      Sorry, but the page you were trying to view does not exist.
  </div>
</div>
  
@endsection