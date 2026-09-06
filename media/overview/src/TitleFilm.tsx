import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, Easing} from 'remotion';

type Props = {brand: string; title: string; detail: string; destination: string; background: string; color: string; accent: string};
export const TitleFilm: React.FC<Props> = ({brand, title, detail, destination, background, color, accent}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor: background, color, fontFamily: 'Arial, sans-serif', padding: 88, justifyContent: 'center'}}>
    <Interactive.Div name="Brand" style={{position:'absolute',left:88,top:100,fontSize:28,letterSpacing:1,fontWeight:700}}>{brand}</Interactive.Div>
    <Interactive.Div name="Accent rule" style={{position:'absolute',left:88,top:164,height:4,backgroundColor:accent,width:interpolate(frame,[0,40],[0,180],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}} />
    <Interactive.Div name="Title" style={{fontSize:96,fontWeight:600,lineHeight:1.04,letterSpacing:-4,maxWidth:880,opacity:interpolate(frame,[0,24],[0,1],{extrapolateRight:'clamp'}),translate:interpolate(frame,[0,32],['0px 28px','0px 0px'],{extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)})}}>{title}</Interactive.Div>
    <Interactive.Div name="Product description" style={{fontSize:44,lineHeight:1.32,maxWidth:850,marginTop:44,opacity:interpolate(frame,[35,60],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{detail}</Interactive.Div>
    <Interactive.Div name="Destination" style={{position:'absolute',bottom:104,left:88,right:88,fontSize:29,lineHeight:1.35,color:accent,opacity:interpolate(frame,[75,100],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{destination}</Interactive.Div>
  </AbsoluteFill>;
};
