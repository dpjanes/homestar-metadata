/*
 *  metadata.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-09-27
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const path = require("path");
const fs = require("fs");

const errors = require("iotdb-errors");
const iotdb_thing = require('iotdb-thing');
const iotdb_transport_iotdb = require('iotdb-transport-iotdb');

/**
 *  Callback by 'make_dynamic' to do the work specific to this form
 */
const thing_metadata = function(request, response, locals, done) {
    if (!request.user || !request.user.is_owner) {
        return done(new errors.NotAuthorized());
    }

    const iotdb_transporter = iotdb_transport_iotdb.make({});
    iotdb_transporter.one({
        id: request.params.thing_id,
    }).subscribe( 
        bandd => {
            const thing = iotdb_thing.make(bandd);

            if (request.method === "POST") {
                const body = request.body;
    
                if (!_.is.Empty(body.name)) {
                    thing.name(body.name);
                }

                thing.facets(body.facets);
                thing.zones(body.zones);

                process.nextTick(() => {
                    iotdb_transporter.put({
                        id: thing.thing_id(),
                        band: "meta",
                        value: _.d.compose.shallow(
                            {
                                "@timestamp": _.timestamp.make(),
                            }, 
                            thing.state("meta")
                        ),
                    }).subscribe(
                        pd => {},
                        error => done(error),
                        () => done(null, "/#" + thing.thing_id())
                    )
                });

                return;
            }

            const _thing_zones = thing.zones();
            const _all_zones = zones();
            const _process_zone = zone => ({
                value: zone,
                name: zone,
                selected: _thing_zones.indexOf(zone) > -1,
            });

            const _thing_facets = thing.facets();
            const _all_facets = facets();
            const _process_facet = facet => ({
                value: facet,
                name: facet.replace(/^.*:/, ":"),
                selected: _thing_facets.indexOf(facet) > -1,
            });


            done(null, {
                id: thing.thing_id(),
                name: thing.name(),
                facets: _all_facets.map(_process_facet),
                zones: _all_zones.map(_process_zone),
            });
        },
        error => done(error)
    );



    /*
    if (request.method === "POST") {
        const updated = {};

        const name = request.body['schema:name']
        if (name && name.length && name !== locals.metadata['schema:name']) {
            updated['schema:name'] = name;
        }

        const new_facets = _.ld.list(request.body, 'iot:facet', []);
        if (!_.is.Equal(locals.metadata_facets, new_facets)) {
            updated['iot:facet'] = new_facets;
        }

        const new_zones = _.ld.list(request.body, 'iot:zone', []);
        if (!_.is.Equal(locals.metadata_zones, new_zones)) {
            updated['iot:zone'] = new_zones;
        }

        if (!_.is.Empty(updated)) {
            thing.update("meta", updated)
            _.extend(locals.metadata, updated);
        }

        response.redirect("/things#" + locals.thing_id);
        return done(null, true);
    }

    return done(null);
    */
};

const _read_txt = path => fs.readFileSync(path, 'utf-8')
    .split("\n")
    .map(line => line.replace(/#.*$/, ''))
    .map(line => line.replace(/^ */, ''))
    .map(line => line.replace(/ *$/, ''))
    .filter(line => !_.is.Empty(line));

const facets = () => _read_txt(path.join(__dirname, "data", "facets.txt"))
const zones = () => _read_txt(path.join(__dirname, "data", "zones.txt"))

/**
 *  API
 */
exports.thing_metadata = thing_metadata;
exports.zones = zones;
exports.facets = facets;
