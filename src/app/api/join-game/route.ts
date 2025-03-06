import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { game_id, player_username } = await request.json();

  const { data, error } = await supabase.rpc("join_game", {
    game_id_input: game_id,
    player_username_input: player_username,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
