import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { game_id, player_id, position } = await request.json();

  const { data, error } = await supabase.rpc("shoot", {
    game_id_input: game_id,
    player_id_input: player_id,
    position_input: position
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}