/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
    //--------------------------------------------------------------------------
    //
    //  Settings String Methods
    //
    //--------------------------------------------------------------------------
    /**
     * Parses a settings array into the parameters
     * @param array Array of the settings values, where elements 0 - 23 are
     *                a: waveType
     *                b: attackTime
     *                c: sustainTime
     *                d: sustainPunch
     *                e: decayTime
     *                f: startFrequency
     *                g: minFrequency
     *                h: slide
     *                i: deltaSlide
     *                j: vibratoDepth
     *                k: vibratoSpeed
     *                l: changeAmount
     *                m: changeSpeed
     *                n: squareDuty
     *                o: dutySweep
     *                p: repeatSpeed
     *                q: phaserOffset
     *                r: phaserSweep
     *                s: lpFilterCutoff
     *                t: lpFilterCutoffSweep
     *                u: lpFilterResonance
     *                v: hpFilterCutoff
     *                w: hpFilterCutoffSweep
     *                x: masterVolume
     * @return If the string successfully parsed
     */
    this.setSettings = function (values) {
        for (var i = 0; i < 24; i++) {
            this[String.fromCharCode(97 + i)] = values[i] || 0;
        }
        // I moved this here from the reset(true) function
        if (this['c'] < .01) {
            this['c'] = .01;
        }
        var totalTime = this['b'] + this['c'] + this['e'];
        if (totalTime < .18) {
            var multiplier = .18 / totalTime;
            this['b'] *= multiplier;
            this['c'] *= multiplier;
            this['e'] *= multiplier;
        }
    };
}
/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
    // All variables are kept alive through function closures
    //--------------------------------------------------------------------------
    //
    //  Sound Parameters
    //
    //--------------------------------------------------------------------------
    this._params = new SfxrParams(); // Params instance
    //--------------------------------------------------------------------------
    //
    //  Synth Variables
    //
    //--------------------------------------------------------------------------
    var _envelopeLength0, // Length of the attack stage
    _envelopeLength1, // Length of the sustain stage
    _envelopeLength2, // Length of the decay stage
    _period, // Period of the wave
    _maxPeriod, // Maximum period before sound stops (from minFrequency)
    _slide, // Note slide
    _deltaSlide, // Change in slide
    _changeAmount, // Amount to change the note by
    _changeTime, // Counter for the note change
    _changeLimit, // Once the time reaches this limit, the note changes
    _squareDuty, // Offset of center switching point in the square wave
    _dutySweep; // Amount to change the duty by
    //--------------------------------------------------------------------------
    //
    //  Synth Methods
    //
    //--------------------------------------------------------------------------
    /**
     * Resets the runing variables from the params
     * Used once at the start (total reset) and for the repeat effect (partial reset)
     */
    this.reset = function () {
        // Shorter reference
        var p = this._params;
        _period = 100 / (p['f'] * p['f'] + .001);
        _maxPeriod = 100 / (p['g'] * p['g'] + .001);
        _slide = 1 - p['h'] * p['h'] * p['h'] * .01;
        _deltaSlide = -p['i'] * p['i'] * p['i'] * .000001;
        if (!p['a']) {
            _squareDuty = .5 - p['n'] / 2;
            _dutySweep = -p['o'] * .00005;
        }
        _changeAmount = 1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
        _changeTime = 0;
        _changeLimit = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
    };
    // I split the reset() function into two functions for better readability
    this.totalReset = function () {
        this.reset();
        // Shorter reference
        var p = this._params;
        // Calculating the length is all that remained here, everything else moved somewhere
        _envelopeLength0 = p['b'] * p['b'] * 100000;
        _envelopeLength1 = p['c'] * p['c'] * 100000;
        _envelopeLength2 = p['e'] * p['e'] * 100000 + 12;
        // Full length of the volume envelop (and therefore sound)
        // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
        return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
    };
    /**
     * Writes the wave to the supplied buffer ByteArray
     * @param buffer A ByteArray to write the wave to
     * @return If the wave is finished
     */
    this.synthWave = function (buffer, length) {
        // Shorter reference
        var p = this._params;
        // If the filters are active
        var _filters = p['s'] != 1 || p['v'], 
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1, 
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003, 
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1, 
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001, 
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1, 
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'], 
        // Minimum frequency before stopping
        _minFreqency = p['g'], 
        // If the phaser is active
        _phaser = p['q'] || p['r'], 
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2, 
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020), 
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0, 
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'], 
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2, 
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01, 
        // The type of wave to generate
        _waveType = p['a'];
        var _envelopeLength = _envelopeLength0, // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)
        // Damping muliplier which restricts how fast the wave position can move
        var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
        if (_lpFilterDamping > .8) {
            _lpFilterDamping = .8;
        }
        _lpFilterDamping = 1 - _lpFilterDamping;
        var _finished = false, // If the sound has finished
        _envelopeStage = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime = 0, // Current time through current enelope stage
        _envelopeVolume = 0, // Current volume of the envelope
        _hpFilterPos = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos, // Previous low-pass wave position
        _lpFilterPos = 0, // Adjusted wave position after low-pass filter
        _periodTemp, // Period modified by vibrato
        _phase = 0, // Phase through the wave
        _phaserInt, // Integer phaser offset, for bit maths
        _phaserPos = 0, // Position through the phaser buffer
        _pos, // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime = 0, // Counter for the repeats
        _sample, // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample, // Actual sample writen to the wave
        _vibratoPhase = 0; // Phase through the vibrato sine wave
        // Buffer of wave values used to create the out of phase second wave
        var _phaserBuffer = new Array(1024), 
        // Buffer of random values used to generate noise
        _noiseBuffer = new Array(32);
        for (var i = _phaserBuffer.length; i--;) {
            _phaserBuffer[i] = 0;
        }
        for (var i = _noiseBuffer.length; i--;) {
            _noiseBuffer[i] = Math.random() * 2 - 1;
        }
        for (var i = 0; i < length; i++) {
            if (_finished) {
                return i;
            }
            // Repeats every _repeatLimit times, partially resetting the sound parameters
            if (_repeatLimit) {
                if (++_repeatTime >= _repeatLimit) {
                    _repeatTime = 0;
                    this.reset();
                }
            }
            // If _changeLimit is reached, shifts the pitch
            if (_changeLimit) {
                if (++_changeTime >= _changeLimit) {
                    _changeLimit = 0;
                    _period *= _changeAmount;
                }
            }
            // Acccelerate and apply slide
            _slide += _deltaSlide;
            _period *= _slide;
            // Checks for frequency getting too low, and stops the sound if a minFrequency was set
            if (_period > _maxPeriod) {
                _period = _maxPeriod;
                if (_minFreqency > 0) {
                    _finished = true;
                }
            }
            _periodTemp = _period;
            // Applies the vibrato effect
            if (_vibratoAmplitude > 0) {
                _vibratoPhase += _vibratoSpeed;
                _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
            }
            _periodTemp |= 0;
            if (_periodTemp < 8) {
                _periodTemp = 8;
            }
            // Sweeps the square duty
            if (!_waveType) {
                _squareDuty += _dutySweep;
                if (_squareDuty < 0) {
                    _squareDuty = 0;
                }
                else if (_squareDuty > .5) {
                    _squareDuty = .5;
                }
            }
            // Moves through the different stages of the volume envelope
            if (++_envelopeTime > _envelopeLength) {
                _envelopeTime = 0;
                switch (++_envelopeStage) {
                    case 1:
                        _envelopeLength = _envelopeLength1;
                        break;
                    case 2:
                        _envelopeLength = _envelopeLength2;
                }
            }
            // Sets the volume based on the position in the envelope
            switch (_envelopeStage) {
                case 0:
                    _envelopeVolume = _envelopeTime * _envelopeOverLength0;
                    break;
                case 1:
                    _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
                    break;
                case 2:
                    _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
                    break;
                case 3:
                    _envelopeVolume = 0;
                    _finished = true;
            }
            // Moves the phaser offset
            if (_phaser) {
                _phaserOffset += _phaserDeltaOffset;
                _phaserInt = _phaserOffset | 0;
                if (_phaserInt < 0) {
                    _phaserInt = -_phaserInt;
                }
                else if (_phaserInt > 1023) {
                    _phaserInt = 1023;
                }
            }
            // Moves the high-pass filter cutoff
            if (_filters && _hpFilterDeltaCutoff) {
                _hpFilterCutoff *= _hpFilterDeltaCutoff;
                if (_hpFilterCutoff < .00001) {
                    _hpFilterCutoff = .00001;
                }
                else if (_hpFilterCutoff > .1) {
                    _hpFilterCutoff = .1;
                }
            }
            _superSample = 0;
            for (var j = 8; j--;) {
                // Cycles through the period
                _phase++;
                if (_phase >= _periodTemp) {
                    _phase %= _periodTemp;
                    // Generates new random noise for this period
                    if (_waveType == 3) {
                        for (var n = _noiseBuffer.length; n--;) {
                            _noiseBuffer[n] = Math.random() * 2 - 1;
                        }
                    }
                }
                // Gets the sample from the oscillator
                switch (_waveType) {
                    case 0:// Square wave
                        _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
                        break;
                    case 1:// Saw wave
                        _sample = 1 - _phase / _periodTemp * 2;
                        break;
                    case 2:// Sine wave (fast and accurate approx)
                        _pos = _phase / _periodTemp;
                        _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
                        _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
                        _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample - _sample) + _sample;
                        break;
                    case 3:// Noise
                        _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
                }
                // Applies the low and high pass filters
                if (_filters) {
                    _lpFilterOldPos = _lpFilterPos;
                    _lpFilterCutoff *= _lpFilterDeltaCutoff;
                    if (_lpFilterCutoff < 0) {
                        _lpFilterCutoff = 0;
                    }
                    else if (_lpFilterCutoff > .1) {
                        _lpFilterCutoff = .1;
                    }
                    if (_lpFilterOn) {
                        _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
                        _lpFilterDeltaPos *= _lpFilterDamping;
                    }
                    else {
                        _lpFilterPos = _sample;
                        _lpFilterDeltaPos = 0;
                    }
                    _lpFilterPos += _lpFilterDeltaPos;
                    _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
                    _hpFilterPos *= 1 - _hpFilterCutoff;
                    _sample = _hpFilterPos;
                }
                // Applies the phaser effect
                if (_phaser) {
                    _phaserBuffer[_phaserPos % 1024] = _sample;
                    _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
                    _phaserPos++;
                }
                _superSample += _sample;
            }
            // Averages out the super samples and applies volumes
            _superSample *= .125 * _envelopeVolume * _masterVolume;
            // Clipping if too loud
            buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
        }
        return length;
    };
}
// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
var jsfxr = function (settings) {
    // Initialize SfxrParams
    synth._params.setSettings(settings);
    // Synthesize Wave
    var envelopeFullLength = synth.totalReset();
    var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
    var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
    var dv = new Uint32Array(data.buffer, 0, 44);
    // Initialize header
    dv[0] = 0x46464952; // "RIFF"
    dv[1] = used + 36; // put total size here
    dv[2] = 0x45564157; // "WAVE"
    dv[3] = 0x20746D66; // "fmt "
    dv[4] = 0x00000010; // size of the following
    dv[5] = 0x00010001; // Mono: 1 channel, PCM format
    dv[6] = 0x0000AC44; // 44,100 samples per second
    dv[7] = 0x00015888; // byte rate: two bytes per sample
    dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
    dv[9] = 0x61746164; // "data"
    dv[10] = used; // put number of samples here
    // Base64 encoding written by me, @maettig
    used += 44;
    var i = 0, base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', output = 'data:audio/wav;base64,';
    for (; i < used; i += 3) {
        var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
        output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
    }
    return output;
};
if (typeof require === 'function') {
    module.exports = jsfxr;
}
else {
    this.jsfxr = jsfxr;
}
var Game;
(function (Game) {
    class Box {
        constructor(pos, w, h) {
            this.pos = pos;
            this.w = w;
            this.h = h;
        }
        test(box) {
            return this.pos.x < box.pos.x + box.w &&
                this.pos.x + this.w > box.pos.x &&
                this.pos.y < box.pos.y + box.h &&
                this.h + this.pos.y > box.pos.y;
        }
        intersect(box) {
            let Ax = this.pos.x, Ay = this.pos.y, AX = Ax + this.w, AY = Ay + this.h, Bx = box.pos.x, By = box.pos.y, BX = Bx + box.w, BY = By + box.h, Cx = Ax < Bx ? Bx : Ax, Cy = Ay < By ? By : Ay, CX = AX < BX ? AX : BX, CY = AY < BY ? AY : BY;
            return new Box(new Game.Vec(Cx, Cy), CX - Cx, CY - Cy);
        }
        clone() {
            return new Box(this.pos.clone(), this.w, this.h);
        }
    }
    Game.Box = Box;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Enemy {
        constructor(pos, speed, sprite) {
            this.collided = new Game.Vec(0, 0);
            this.frame = 0;
            this.walk = false;
            this.box = new Game.Box(pos, 16, 16);
            this.speed = speed;
            this.sprite = sprite;
        }
        render(ctx) {
            this.sprite.render(ctx, this.box, 0, this.frame != 3 ? this.frame : 1);
        }
        update(tick) {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
            if (this.collided.y) {
                this.speed.y = -this.speed.y;
            }
            if (this.collided.x) {
                this.speed.x = -this.speed.x;
            }
        }
    }
    Game.Enemy = Enemy;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Hero {
        constructor(x, y, sprite) {
            this.collided = new Game.Vec(0, 0);
            this.face = 0;
            this.walk = true;
            this.frame = 1;
            this.sprite = sprite;
            this.speed = new Game.Vec(0, 1);
            this.box = new Game.Box(new Game.Vec(x, y), 16, 24);
        }
        render(ctx) {
            let box = this.box.clone(), pos = box.pos, x = pos.x, y = pos.y, w = box.w, h = box.h, top = this.face * h, walk = this.walk, frame = this.frame, sprite = this.sprite;
            if (walk) {
                frame = frame < 3 ? frame : 1;
                sprite.render(ctx, box, top, frame + 1);
            }
            else {
                sprite.render(ctx, box, top, 0);
                sprite.render(ctx, box, top, frame + 4);
            }
        }
        update(tick) {
            if (tick % 8 == 0) {
                if (!this.walk) {
                    this.frame = ++this.frame % 3;
                }
                else if (this.speed.x != 0) {
                    this.frame = ++this.frame % 4;
                }
            }
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Platform {
        constructor(x, y, width, height) {
            this.box = new Game.Box(new Game.Vec(x, y), width, height);
        }
        render(ctx, sprite) {
            const box = this.box;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
        }
    }
    Game.Platform = Platform;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Scene {
        constructor(ctx, img) {
            this.tick = 0;
            this.width = 256;
            this.sprite = new Game.Sprite(img, this.width);
            this.hero = new Game.Hero(96, 160, this.sprite.crop(ctx, 0, 0, 112, 48));
            this.ship = new Game.Ship(160, 136, this.sprite.crop(ctx, 0, 88, 48, 48));
            this.platforms = [
                new Game.Platform(-50, 0, 350, 16),
                new Game.Platform(32, 72, 48, 8),
                new Game.Platform(120, 96, 32, 8),
                new Game.Platform(192, 48, 48, 8),
                new Game.Platform(-50, 184, 350, 8),
            ];
            let sprite = this.sprite.crop(ctx, 0, 48, 48, 16), speed = new Game.Vec(.5, -.5);
            this.enemies = [
                new Game.Enemy(new Game.Vec(0, 20), speed.clone(), sprite),
                new Game.Enemy(new Game.Vec(0, 60), speed.clone(), sprite),
                new Game.Enemy(new Game.Vec(0, 100), speed.clone(), sprite),
                new Game.Enemy(new Game.Vec(0, 140), speed.clone(), sprite),
            ];
        }
        back(ctx) {
            if (this.cache) {
                ctx.drawImage(this.cache, 0, 0);
                return;
            }
            let sky = ctx.createLinearGradient(0, 0, 0, 192);
            sky.addColorStop(0, "#002");
            sky.addColorStop(1, "#224");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (let i = 1; i < this.platforms.length; i++) {
                let box = this.platforms[i].box.clone(), num = Math.round(box.w / 8) - 1;
                box.w = 8;
                this.sprite.render(ctx, box, 80, 0);
                for (let j = 1; j < num; j++) {
                    box.pos.x += box.w;
                    this.sprite.render(ctx, box, 80, 1);
                }
                box.pos.x += box.w;
                this.sprite.render(ctx, box, 80, 2);
            }
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }
        render(ctx) {
            this.back(ctx);
            this.ship.render(ctx);
            this.hero.render(ctx);
            this.enemies.forEach(enemy => {
                enemy.render(ctx);
            });
        }
        update() {
            this.hero.update(this.tick);
            this.move(this.hero);
            this.enemies.forEach(enemy => {
                enemy.update(this.tick);
                this.move(enemy);
            });
            this.tick++;
        }
        move(item) {
            let collided = item.collided, speed = item.speed, pos = item.box.pos, old = pos.clone(), walk = false;
            pos.x += speed.x;
            if (pos.x > this.width) {
                pos.x -= this.width;
            }
            else if (pos.x < 0) {
                pos.x += this.width;
            }
            collided.x = 0;
            this.platforms.forEach(platform => {
                if (platform.box.test(item.box)) {
                    pos.x = old.x;
                    collided.x = 1;
                }
            });
            pos.y += speed.y;
            collided.y = 0;
            this.platforms.forEach(platform => {
                if (platform.box.test(item.box)) {
                    pos.y = old.y;
                    collided.y = 1;
                    if (speed.y > 0) {
                        walk = true;
                    }
                }
            });
            item.walk = walk;
        }
    }
    Game.Scene = Scene;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Ship {
        constructor(x, y, sprite) {
            this.sprite = sprite;
            this.boxes = [
                new Game.Box(new Game.Vec(x, y), 16, 16),
                new Game.Box(new Game.Vec(x, y + 16), 16, 16),
                new Game.Box(new Game.Vec(x, y + 32), 16, 16),
            ];
        }
        render(ctx) {
            this.boxes.forEach((box, i) => {
                this.sprite.render(ctx, box, box.h * i, 0);
            });
        }
    }
    Game.Ship = Ship;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Sprite {
        constructor(img, width) {
            this.img = img;
            this.width = width;
        }
        render(ctx, box, top, frame) {
            let pos = box.pos, x = Math.round(pos.x), y = Math.round(pos.y), w = Math.round(box.w), h = Math.round(box.h);
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
            if (x + w > this.width) {
                ctx.drawImage(this.img, w * frame, top, w, h, x - this.width, y, w, h);
            }
        }
        crop(ctx, x, y, w, h, flipV = false, flipH = false) {
            let img = new Image(), canvas = ctx.canvas, width = canvas.width, height = canvas.height;
            canvas.width = w;
            canvas.height = h;
            ctx.save();
            ctx.translate(flipV ? w : 0, flipH ? h : 0);
            ctx.scale(flipV ? -1 : 1, flipH ? -1 : 1);
            ctx.drawImage(this.img, -x, -y);
            ctx.restore();
            img.src = canvas.toDataURL();
            canvas.width = width;
            canvas.height = height;
            return new Sprite(img, this.width);
        }
    }
    Game.Sprite = Sprite;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Vec {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new Vec(this.x, this.y);
        }
    }
    Game.Vec = Vec;
})(Game || (Game = {}));
/// <reference path="../typings/index.d.ts" />
var Game;
(function (Game) {
    function $(query, element) {
        return (element || document).querySelector(query);
    }
    function on(element, event, callback) {
        element.addEventListener(event, callback, false);
    }
    let canvas, ctx, scene;
    function resize() {
        let body = document.body, portrait = body.clientWidth / body.clientHeight < canvas.width / canvas.height;
        canvas.style.width = portrait ? '100%' : '';
        canvas.style.height = portrait ? '' : '100%';
    }
    function bind() {
        const hero = scene.hero;
        on(document, 'keydown', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                hero.speed.y = -1;
            }
            else if (key == 37 || key == 65 || key == 97) {
                hero.speed.x = -1;
                hero.face = 0;
            }
            else if (key == 39 || key == 68 || key == 100) {
                hero.speed.x = 1;
                hero.face = 1;
            }
        });
        on(document, 'keyup', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                hero.speed.y = 1;
            }
            else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                hero.speed.x = 0;
            }
        });
        on(window, 'resize', resize);
    }
    function update() {
        requestAnimationFrame(() => {
            update();
        });
        scene.update();
        scene.render(ctx);
    }
    on(window, 'load', () => {
        const img = $('#sprite');
        canvas = $('#game');
        ctx = canvas.getContext('2d');
        scene = new Game.Scene(ctx, img);
        bind();
        resize();
        update();
    });
})(Game || (Game = {}));

//# sourceMappingURL=script.js.map
