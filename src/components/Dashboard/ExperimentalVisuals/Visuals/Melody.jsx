import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import SingleSlider from '../../../UI/SingleSlider';
import MelodyPartitura from './MelodyPartitura';

export default function Melody({ valuesFreeRNG = [] }) {
  const [evenDuration, setEvenDuration] = useState('8n');
  const [oddDuration, setOddDuration] = useState('4n');
  const [volume, setVolume] = useState(0);
  const [instrumentType, setInstrumentType] = useState('synth');
  const [staffEvents, setStaffEvents] = useState([]);
const [loopEndTime, setLoopEndTime] = useState(0);


  const evenRef = useRef(evenDuration);
  const oddRef = useRef(oddDuration);
  const synthRef = useRef(null);
  const partRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    evenRef.current = evenDuration;
  }, [evenDuration]);

  useEffect(() => {
    oddRef.current = oddDuration;
  }, [oddDuration]);

  useEffect(() => {
    Tone.start();
    restartSequence();
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      partRef.current?.dispose();
      synthRef.current?.dispose();
      volumeRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!valuesFreeRNG.length || !partRef.current) return;
    const newSynth = createSynth();
    synthRef.current?.dispose();
    synthRef.current = newSynth;
  }, [instrumentType]);

  useEffect(() => {
    if (!valuesFreeRNG.length) return;
    restartSequence();
  }, [valuesFreeRNG]);

  useEffect(() => {
    if (!valuesFreeRNG.length || !partRef.current) return;
    updatePart();
  }, [evenDuration, oddDuration]);

  useEffect(() => {
    if (volumeRef.current) {
      volumeRef.current.volume.value = Tone.gainToDb(volume / 10); // dB from 0.0–1.0
    }
  }, [volume]);

  const createSynth = () => {
    volumeRef.current?.dispose();
    volumeRef.current = new Tone.Volume(Tone.gainToDb(volume / 10)).toDestination();

    switch (instrumentType) {
      case 'futuristic':
        return new Tone.MonoSynth().connect(volumeRef.current);
      case 'electric':
        return new Tone.Synth({ oscillator: { type: 'sawtooth' } }).connect(volumeRef.current);
      default:
        return new Tone.Synth().connect(volumeRef.current);
    }
  };

  const restartSequence = async () => {
    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel();
    partRef.current?.dispose();
    synthRef.current?.dispose();
    volumeRef.current?.dispose();
    synthRef.current = createSynth();
    generateAndStartPart();
    Tone.Transport.start('+0.1');
  };

  const generateEvents = async () => {
  // ✳️ Fase 1: Desactiva la partitura
  setStaffEvents([]);
  setLoopEndTime(0);
  await new Promise((res) => setTimeout(res, 100)); // 🔁 Dona temps al missatge per aparèixer

  const scale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'];
  let currentTime = 0;

  const events = valuesFreeRNG.map((val) => {
    const isEven = val % 2 === 0;
    const duration = Tone.Time(isEven ? evenRef.current : oddRef.current).toSeconds();
    const note = scale[val % scale.length];
    const time = currentTime;
    currentTime += duration;
    return [time, { note, duration, original: val }];

  });

  // ✳️ Fase 2: Ara sí, activa la partitura
  setStaffEvents(events);
  setLoopEndTime(currentTime);

  return { events, loopEnd: currentTime };
};


  const generateAndStartPart = async () => {
  const { events, loopEnd } = await generateEvents();

  const part = new Tone.Part((time, value) => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(value.note, value.duration, time);
    }
  }, events);

  part.loop = true;
  part.loopEnd = `${loopEnd}`;
  part.start(0);
  partRef.current = part;
};


  const updatePart = async () => {
  const { events, loopEnd } = await generateEvents();

  const newPart = new Tone.Part((time, value) => {
    if (synthRef.current) {
      synthRef.current.triggerAttackRelease(value.note, value.duration, time);
    }
  }, events);

  newPart.loop = true;
  newPart.loopEnd = `${loopEnd}`;
  newPart.start(0);

  partRef.current?.dispose();
  partRef.current = newPart;
};


  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center md:items-start mb-6 px-6">
        {/* 🎚️ Slider de Volum */}
       <div className="bg-[#b0cad2] px-8 py-3 rounded-lg shadow min-w-[270px]">
        <div className="flex items-center gap-4 translate-x-2.5">
          <label className="text-sm text-gray-800  mt-5.5 font-semibold whitespace-nowrap">Volume</label>
          <div className="flex-1 ">
            <SingleSlider min={0} max={10} value={volume} onChange={setVolume} barSizePercentage={80} />
          </div>
        </div>
      </div>

        {/* 🕒 Durations */}
        <div className="bg-[#b0cad2] px-6 py-4 rounded-lg shadow flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-800">Even Numbers</label>
            <select
              value={evenDuration}
              onChange={(e) => setEvenDuration(e.target.value)}
              className="rounded px-2 py-1 border border-gray-600 text-gray-800 bg-gray-100"
            >
              <option value="2n">White (2n)</option>
              <option value="4n">Black (4n)</option>
              <option value="8n">Eighth (8n)</option>
              <option value="16n">Sixteenth (16n)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-800">Odd Numbers</label>
            <select
              value={oddDuration}
              onChange={(e) => setOddDuration(e.target.value)}
              className="rounded px-2 py-1 border border-gray-600 text-gray-800 bg-gray-100"
            >
              <option value="2n">White (2n)</option>
              <option value="4n">Black (4n)</option>
              <option value="8n">Eighth (8n)</option>
              <option value="16n">Sixteenth (16n)</option>
            </select>
          </div>
        </div>

        {/* 🎛️ Instruments */}
<div className="flex gap-6 bg-[#b0cad2] px-6 py-5.5 rounded-lg shadow min-w-[270px] justify-center">
  <label className="flex items-center gap-2 text-sm text-gray-800">
    <input
      type="radio"
      name="melody-instrument"
      value="synth"
      checked={instrumentType === 'synth'}
      onChange={() => setInstrumentType('synth')}
      className="appearance-none w-3 h-3 rounded-full
                 ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                 bg-[#94a3b8] checked:bg-gray-600"
    />
    Default Synth
  </label>
  <label className="flex items-center gap-2 text-sm text-gray-800">
    <input
      type="radio"
      name="melody-instrument"
      value="futuristic"
      checked={instrumentType === 'futuristic'}
      onChange={() => setInstrumentType('futuristic')}
      className="appearance-none w-3 h-3 rounded-full
                 ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                 bg-[#94a3b8] checked:bg-gray-600"
    />
    Futuristic
  </label>
  <label className="flex items-center gap-2 text-sm text-gray-800">
    <input
      type="radio"
      name="melody-instrument"
      value="electric"
      checked={instrumentType === 'electric'}
      onChange={() => setInstrumentType('electric')}
      className="appearance-none w-3 h-3 rounded-full
                 ring-1 ring-gray-800 checked:ring-2 checked:ring-gray-800
                 bg-[#94a3b8] checked:bg-gray-600"
    />
    Electric
  </label>
</div>

      </div>
            {/* <-- aquest tanca els selectors */}
      <MelodyPartitura events={staffEvents} loopEnd={loopEndTime} />

    </div>
  );
}
