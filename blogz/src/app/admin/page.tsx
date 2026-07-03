"use client";

import { useAuthStore } from "@/store/authStore"; 
import { useAuth } from "@/hooks/useAuth"; 
import { usePostMutations, usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, LogOut, ShieldAlert, PlusCircle, FolderHeart, Trash2, Edit } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { loginWithGoogle, logout } = useAuth(); 
  const { deletePost, isDeleting } = usePostMutations();
  const { data: posts, isLoading: isLoadingPosts } = usePosts();
  
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // 1. Unauthenticated State (Not Logged In)
  if (!currentUser) {
    return (
      <div className="container max-w-md mx-auto px-4 py-20">
        <Card className="border-muted shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Gate</CardTitle>
            <CardDescription>
              Sign in with your authorized Google account to manage BLOGZ.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button onClick={loginWithGoogle} className="w-full gap-2 flex items-center justify-center py-6 text-base font-medium">
              <LogIn className="w-5 h-5" /> Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Unauthorized State (Logged in with wrong email)
  if (currentUser.email !== adminEmail) {
    return (
      <div className="container max-w-md mx-auto px-4 py-20">
        <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-destructive/10 text-destructive p-3 rounded-full w-fit">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold text-destructive">Not Authorized</CardTitle>
            <CardDescription>
              The account <span className="font-semibold text-foreground">{currentUser.email}</span> does not have access to this portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-2">
            <Button variant="outline" onClick={logout} className="w-full gap-2">
              <LogOut className="w-4 h-4" /> Switch Account / Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Authorized State (Full Dashboard)
  return (
    <main className="container max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-muted">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Console Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Logged in as: {currentUser.email}</p>
        </div>
        <Button variant="ghost" onClick={logout} className="gap-2 self-start md:self-auto text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4" /> Disconnect
        </Button>
      </div>

      <Tabs defaultValue="create" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="create" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <PlusCircle className="w-4 h-4" /> Create Post
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
            <FolderHeart className="w-4 h-4" /> Manage Posts ({posts?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="outline-none">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle>{editingPostSlug ? "Modify Post" : "Draft a New Entry"}</CardTitle>
              <CardDescription>Compose content, assign metrics, and push to live production.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                [TipTap Editor Component Integration Point — Step 12]
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="outline-none">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle>Content Inventory</CardTitle>
              <CardDescription>Review, alter metadata configurations, or eliminate live production blocks.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full bg-muted/60 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="divide-y divide-muted border rounded-xl overflow-hidden bg-card">
                  {posts.map((post) => (
                    <div key={post.slug} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="space-y-1 pr-4">
                        <p className="font-semibold text-base line-clamp-1">{post.title}</p>
                        <span className="inline-flex text-xs px-2.5 py-0.5 rounded-full capitalize bg-muted font-medium text-muted-foreground">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5 h-9" onClick={() => setEditingPostSlug(post.slug)}>
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="gap-1.5 h-9"
                          disabled={isDeleting}
                          onClick={async () => {
                            if (confirm(`Permanently remove "${post.title}"?`)) {
                              await deletePost(post.slug);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No active entries found. Start by writing your first article!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}