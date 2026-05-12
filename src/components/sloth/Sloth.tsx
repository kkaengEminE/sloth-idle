import { useRef } from 'react';
import * as THREE from 'three';
import SlothHead from './SlothHead';
import SlothBody from './SlothBody';
import SlothArm from './SlothArm';
import SlothLeg from './SlothLeg';
import ExclamationMark from '@/components/effects/ExclamationMark';
import Zzz from '@/components/effects/Zzz';
import DustPoof from '@/components/effects/DustPoof';
import { useSlothAnimations } from '@/hooks/useSlothAnimations';
import { useSlothMovement } from '@/hooks/useSlothMovement';
import { useSlothStateMachine } from '@/hooks/useSlothStateMachine';
import { useDelayedReactions } from '@/hooks/useDelayedReactions';
import { useStatDecay } from '@/hooks/useStatDecay';
import { useGrabInteraction } from '@/hooks/useGrabInteraction';
import { SLOTH_INITIAL_POSITION } from '@/constants/world';

export default function Sloth() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const refs = {
    groupRef,
    bodyRef,
    headRef,
    leftArmRef,
    rightArmRef,
    leftLegRef,
    rightLegRef,
  };

  useSlothStateMachine(refs);
  useSlothAnimations(refs);
  useSlothMovement(refs);
  useDelayedReactions();
  useStatDecay();

  const { onPointerDown, onPointerUp } = useGrabInteraction(refs);

  return (
    <>
      <group
        ref={groupRef}
        position={SLOTH_INITIAL_POSITION}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <SlothBody ref={bodyRef}>
          <SlothHead ref={headRef} />
          <SlothArm ref={leftArmRef} side="left" />
          <SlothArm ref={rightArmRef} side="right" />
          <SlothLeg ref={leftLegRef} side="left" />
          <SlothLeg ref={rightLegRef} side="right" />
        </SlothBody>
        <ExclamationMark />
        <Zzz />
      </group>
      <DustPoof />
    </>
  );
}
