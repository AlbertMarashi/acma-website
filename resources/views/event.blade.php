{{--
  Template Name: Event
--}}

@extends('layouts.app')

@section('content')

@php the_post() @endphp

<div class="hero">
  <div class="inner-hero image padding-small center column" style="background-image: url({{ get_the_post_thumbnail_url() }})">
    <h1 class="title shadow">{!! get_the_title() !!}</h1>
    @if(get_field('date-start'))
      <div class="time shadow">
        <div class="time-length">
            <div class="time-date" id="days"></div>
            <div class="time-text">
              Days
            </div>
        </div>
        <div class="time-length">
            <div class="time-date" id="hours"></div>
            <div class="time-text">
              Hours
            </div>
        </div>
        <div class="time-length">
            <div class="time-date" id="minutes"></div>
            <div class="time-text">
              Minutes
            </div>
        </div>
      </div>
      
      <script>
          var countDownDate = new Date({{ DateTime::createFromFormat("d\/m\/Y H:i a", get_field("date-start"))->format('U').'000' }}).getTime()
          
          function countdown (){
            var now = new Date().getTime()
            var distance = countDownDate - now

            if(distance > 0){
              var days = Math.floor(distance / (1000 * 60 * 60 * 24))
              var hours = Math.abs(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
              var minutes = Math.abs(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
      
              document.getElementById('days').innerHTML = days
              document.getElementById('hours').innerHTML = hours
              document.getElementById('minutes').innerHTML = minutes
            }else{
              document.getElementById('days').innerHTML = 0
              document.getElementById('hours').innerHTML = 0
              document.getElementById('minutes').innerHTML = 0
            }
          }
          countdown()
          setInterval(countdown, 5000)

        </script>
    @endif
    @php
        $date = new DateTime();
        $unixdate = $date->format('U').'000' + 0;
        $eventdate = DateTime::createFromFormat("d\/m\/Y H:i a", get_field("date-start"))->format('U').'000' + 0;
    @endphp
    
    @if(get_field('book-link') && $eventdate >= $unixdate)
      <a class="button featured bright box-shadow" href="{{ get_field('book-link') }}">BOOK NOW</a>
    @endif
  </div>
  <div class="inner-hero page">
    <div class="inner-page">
      @if(get_field('book-link') || get_field('date-start') || get_field('date-finish') || get_field('where'))
        @if(get_field('date-start'))
          <p><strong>When: </strong>{{ get_field('date-start') }}</p>
        @endif
        @if(get_field('date-finish'))
          <p><strong>Until: </strong>{{ get_field('date-finish') }}</p>
        @endif
        @if(get_field('where'))
          <p><strong>Where: </strong>{{ get_field('where') }}</p>
        @endif
        @if(get_field('book-link') && $eventdate >= $unixdate)
          <a class="button featured bright small-button-text" href="{{ get_field('book-link') }}">BOOK NOW</a>
        @endif
      @endif
      {{ the_content() }}
      @if(get_field('book-link') && $eventdate >= $unixdate)
        <a class="button featured bright small-button-text" href="{{ get_field('book-link') }}">BOOK NOW</a>
      @endif
    </div>
  </div>
</div>

@endsection
