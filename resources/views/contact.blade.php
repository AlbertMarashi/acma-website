{{--
  Template Name: Contact Page
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero image" style="background-image: url({{ get_the_post_thumbnail_url() }})">
  <div class="inner-hero page-text padding-small center column text-center" >
    <h1 class="title shadow">{!! get_the_title() !!}</h1>
    {{ the_content() }}
  </div>
</div>
<div class="hero">
  <div class="inner-hero padding-tiny max">
    <div class="card padding-tiny max-400">
      {!! do_shortcode('[contact-form-7 title="Contact"]') !!}
      <hr class="splitter-small">
      <div class='flex column center padding-tiny'>
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
</div>

@endsection