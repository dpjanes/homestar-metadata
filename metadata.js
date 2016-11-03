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
            const _process_zone = zone => _.d.add(zone, "selected", _thing_zones.indexOf(zone.value) > -1);

            const _thing_facets = thing.facets();
            const _process_facet = facet => _.d.add(facet, "selected", _thing_facets.indexOf(facet.value) > -1);

            done(null, {
                id: thing.thing_id(),
                name: thing.name(),
                facets: facets().map(_process_facet),
                zones: zones().map(_process_zone),
            });
        },
        error => done(error)
    );
};

const _read_txt = path => fs.readFileSync(path, 'utf-8')
    .split("\n")
    .map(line => line.replace(/#.*$/, ''))
    .map(line => line.replace(/^ */, ''))
    .map(line => line.replace(/ *$/, ''))
    .filter(line => !_.is.Empty(line));

const facets = () => _read_txt(path.join(__dirname, "data", "facets.txt"))
    .map(facet => ({
        value: facet,
        name: facet.replace(/^.*:/, ":"),
    }))
    .sort((a, b) => _.is.unsorted(a.name, b.name))

const zones = () => _read_txt(path.join(__dirname, "data", "zones.txt"))
    .map(zone => ({
        value: zone,
        name: zone,
    }))
    .sort((a, b) => _.is.unsorted(a.name, b.name))

/**
 *  API
 */
exports.thing_metadata = thing_metadata;
exports.zones = zones;
exports.facets = facets;
