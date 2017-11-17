CREATE VIEW synoptics_weather AS SELECT gpf.objectid,
    gpf.the_geom AS location,
    gpf.created_at,
    (((gpf.properties)::json ->> 'id'::text))::integer AS id,
    ((gpf.properties)::json ->> 'stid'::text) AS station_id,
    ((gpf.properties)::json ->> 'name'::text) AS station_name,
    ((gpf.properties)::json ->> 'status'::text) AS status,
    ((gpf.properties)::json ->> 'state'::text) AS state,
    (((gpf.properties)::json ->> 'air_temp'::text))::double precision AS air_temperature,
    (((gpf.properties)::json ->> 'wind_speed'::text))::double precision AS wind_speed,
    (((gpf.properties)::json ->> 'wind_direction'::text))::double precision AS wind_direction,
    (((gpf.properties)::json ->> 'wind_gust'::text))::double precision AS wind_gust,
    (((gpf.properties)::json ->> 'dew_point_temperature'::text))::double precision AS dew_point_temperature,
    (((gpf.properties)::json ->> 'relative_humidity'::text))::double precision AS relative_humidity,
    ((gpf.properties)::json ->> 'more_observations'::text) AS more_observations,
    ((gpf.properties)::json ->> 'description'::text) AS description,
    (((gpf.properties)::json ->> 'date_time'::text))::timestamp with time zone AS observation_recorded_at,
    ((gpf.properties)::json ->> 'qc_status'::text) AS qc_status
   FROM geojson_point_feeds gpf
  WHERE (((gpf.feedname)::text = 'synoptics'::text) AND ((((gpf.properties)::json ->> 'date_time'::text))::timestamp with time zone >= (now() - '01:00:00'::interval)))
;
