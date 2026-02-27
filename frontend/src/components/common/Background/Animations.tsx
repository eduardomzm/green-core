export const Animations = () => (
  <style>{`
    @keyframes fallFromSky {
      0%   { transform: translateY(-600px); opacity: 0; }
      60%  { transform: translateY(20px);  opacity: 1; }
      80%  { transform: translateY(-8px);  opacity: 1; }
      100% { transform: translateY(0);     opacity: 1; }
    }
    @keyframes slideFromLeft {
      0%   { transform: translateX(-500px); opacity: 0; }
      70%  { transform: translateX(15px);   opacity: 1; }
      100% { transform: translateX(0);      opacity: 1; }
    }
    @keyframes slideFromRight {
      0%   { transform: translateX(500px); opacity: 0; }
      70%  { transform: translateX(-15px); opacity: 1; }
      100% { transform: translateX(0);     opacity: 1; }
    }
    @keyframes growFromGround {
      0%   { transform: scaleY(0) translateY(40px); opacity: 0; transform-origin: bottom center; }
      60%  { transform: scaleY(1.08) translateY(0); opacity: 1; transform-origin: bottom center; }
      100% { transform: scaleY(1) translateY(0);    opacity: 1; transform-origin: bottom center; }
    }
    @keyframes buildingsSlideLeft {
      0%   { transform: translateX(400px); opacity: 0; }
      70%  { transform: translateX(-10px); opacity: 1; }
      100% { transform: translateX(0);     opacity: 1; }
    }
    @keyframes buildingsSlideRight {
      0%   { transform: translateX(-400px); opacity: 0; }
      70%  { transform: translateX(10px);   opacity: 1; }
      100% { transform: translateX(0);      opacity: 1; }
    }
    @keyframes fadeIn {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }

    .anim-fall-bin-1 { animation: fallFromSky 1s cubic-bezier(.22,.68,.36,1.1) 0.2s both; }
    .anim-fall-bin-2 { animation: fallFromSky 1s cubic-bezier(.22,.68,.36,1.1) 0.45s both; }
    .anim-fall-bin-3 { animation: fallFromSky 1s cubic-bezier(.22,.68,.36,1.1) 0.7s both; }
    .anim-girl { animation: slideFromRight 1.1s cubic-bezier(.22,.68,.36,1) 0.6s both; }
    .anim-trees { animation: growFromGround 1s cubic-bezier(.22,.68,.36,1.05) 0.3s both; transform-origin: bottom center; }
    .anim-bushes { animation: growFromGround 0.9s cubic-bezier(.22,.68,.36,1.05) 0.5s both; transform-origin: bottom center; }
    .anim-buildings-right { animation: buildingsSlideLeft 1.2s cubic-bezier(.22,.68,.36,1) 0s both; }
    .anim-buildings-left { animation: buildingsSlideRight 1.2s cubic-bezier(.22,.68,.36,1) 0s both; }
    .anim-clouds { animation: fadeIn 1.5s ease 0.8s both; }
    .anim-ground { animation: fadeIn 0.6s ease 0s both; }
  `}</style>
);