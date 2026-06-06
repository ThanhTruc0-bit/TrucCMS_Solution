using Grpc.Core;
using CMS.Data;
using CMS.Backend;
public class PostGrpcService : PostService.PostServiceBase
{
    private readonly ApplicationDbContext _context;

    public PostGrpcService(ApplicationDbContext context)
    {
        _context = context;
    }

    public override Task<PostReply> GetPost(PostRequest request, ServerCallContext context)
    {
        var post = _context.Posts.FirstOrDefault(x => x.Id == request.Id);

        return Task.FromResult(new PostReply
        {
            Id = post?.Id ?? 0,
            Title = post?.Title ?? "Not found"
        });
    }
}