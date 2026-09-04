import { Opening } from "@/components/scenes/Opening";
import { Belief } from "@/components/scenes/Belief";
import { Machine } from "@/components/scenes/Machine";
import { Breath } from "@/components/scenes/Breath";
import { WorkWall } from "@/components/scenes/WorkWall";
import { Evolution } from "@/components/scenes/Evolution";
import { Closing } from "@/components/scenes/Closing";
import { Zombie } from "@/components/interruptions/Zombie";

/* ============================================================================
   THE HOMEPAGE
   ----------------------------------------------------------------------------
   One continuous room, read top to bottom. The rhythm is the design:

     quiet     Opening    a greeting, a hanging weight, the local time
     curious   Belief     the page corrects itself in front of you
     dense     Machine    the room goes dark; a system fails and recovers
     quiet     Breath     almost nothing, so the last scene means something
     dense     WorkWall   nine systems as instrument labels
     playful   Zombie     a stray position wanders in and gets cleaned up
     curious   Evolution  four years drawn as one line learning to be straight
     warm      Closing    the door, left open, and a receipt

   Nothing here is a section header followed by a grid of cards.
   ========================================================================= */

export default function Home() {
  return (
    <main>
      <Opening />
      <Belief />
      <Machine />
      <Breath />
      <WorkWall />
      <Zombie />
      <Evolution />
      <Closing />
    </main>
  );
}
