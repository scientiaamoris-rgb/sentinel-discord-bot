client.once('ready', async () => {
  console.log(`🔥 Sentinel ONLINE as ${client.user.tag}`);

  // Update Sentinel status
  await supabase
    .from('workers')
    .update({
      status: 'online',
      last_seen_at: new Date().toISOString()
    })
    .eq('slug', 'sentinel');

  // Log startup
  await supabase.from('events').insert({
    type: 'status',
    payload: {
      message: 'Sentinel connected',
      time: new Date().toISOString()
    }
  });
});
