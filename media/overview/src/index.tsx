import {Composition, registerRoot} from 'remotion';
import {TitleFilm} from './TitleFilm';

const Root = () => <>
  <Composition id="Foundation" component={TitleFilm} durationInFrames={360} fps={30} width={1080} height={1080} defaultProps={{brand:'The SozoRock Foundation',title:'Access. Assurance. Intelligence.',detail:'Platforms for better health and public systems.',destination:'www.sozorockfoundation.org',background:'#13294b',color:'#ffffff',accent:'#a5c8ff'}} />
  <Composition id="Health" component={TitleFilm} durationInFrames={360} fps={30} width={1080} height={1080} defaultProps={{brand:'SozoRock Health',title:'A clearer path to care.',detail:'Health Equity Hubs and Health Access Day connect communities around local access needs.',destination:'health.sozorockfoundation.org',background:'#f2f6f3',color:'#183c32',accent:'#285f49'}} />
  <Composition id="PlaceIntelligence" component={TitleFilm} durationInFrames={360} fps={30} width={1080} height={1080} defaultProps={{brand:'SozoRock Health · Place Intelligence',title:'Start with a place. Follow the evidence.',detail:'Read public evidence with its geography, source, date, and limits.',destination:'health.sozorockfoundation.org/explore',background:'#183c32',color:'#ffffff',accent:'#c0d9cb'}} />
  <Composition id="CBCAP" component={TitleFilm} durationInFrames={360} fps={30} width={1080} height={1080} defaultProps={{brand:'SozoRock Health · CB-CAP',title:'From local evidence to planning questions.',detail:'Compare county context. Test a scenario. Build a stakeholder brief.',destination:'cbcap.sozorockfoundation.org',background:'#f6f8fb',color:'#192a40',accent:'#305cc9'}} />
</>;
registerRoot(Root);
